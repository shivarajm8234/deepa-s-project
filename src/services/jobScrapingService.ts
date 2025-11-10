import { supabase } from '../lib/supabase';
import { jobEmailNotificationService } from './jobEmailNotification';

interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  url: string;
  source: string;
  postedDate?: string;
  jobType?: string;
  remote?: boolean;
  tags: string[];
  type: 'government' | 'non-government';
  experience: string;
  deadline: string;
}

interface JobScrapingResponse {
  jobs: ScrapedJob[];
  total: number;
  query: string;
  location: string;
  timestamp: string;
  sources?: string[];
  success?: boolean;
  error?: string;
}

class JobScrapingService {
  private pendingRequests: Map<string, Promise<JobScrapingResponse>> = new Map();
  
  constructor() {
    // Service initialization
  }
  
  private getRequestKey(query: string, location: string): string {
    return `${query.toLowerCase()}-${location.toLowerCase()}`;
  }

  async scrapeJobs(query: string, location: string, sendEmail: boolean = true): Promise<JobScrapingResponse> {
    const searchQuery = query || 'software engineer';
    const searchLocation = location || 'Bangalore';
    const requestKey = this.getRequestKey(searchQuery, searchLocation);
    
    // If there's already a pending request for this query/location, return that instead
    if (this.pendingRequests.has(requestKey)) {
      console.log(`Returning existing request for: ${searchQuery} in ${searchLocation}`);
      return this.pendingRequests.get(requestKey)!;
    }
    
    // Create a new request and store it
    const requestPromise = this.fetchJobsFromAPI(searchQuery, searchLocation)
      .then(async (response) => {
        // Send email notification if requested and jobs were found
        if (sendEmail && response.jobs && response.jobs.length > 0) {
          try {
            const canSend = await jobEmailNotificationService.canSendNotification();
            if (canSend) {
              await jobEmailNotificationService.sendJobNotificationToUser(
                response.jobs, 
                searchQuery, 
                searchLocation
              );
              console.log(`Email notification sent for ${response.jobs.length} jobs`);
            } else {
              console.log('User not authenticated or no email available - skipping email notification');
            }
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Don't fail the entire request if email fails
          }
        }
        return response;
      })
      .finally(() => {
        // Clean up the pending request when it completes
        this.pendingRequests.delete(requestKey);
      });
    
    this.pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  }

  private async fetchJobsFromAPI(query: string, location: string): Promise<JobScrapingResponse> {
    console.log('Fetching fresh job data from server...');
    
    const searchQuery = query || 'software engineer';
    const searchLocation = location || 'Bangalore';
    
    console.log(`Searching for: "${searchQuery}" in "${searchLocation}"`);
    
    try {
      // First try to use the Supabase function
      try {
        const { data, error } = await supabase.functions.invoke('scrape-jobs', {
          body: {
            query: searchQuery,
            location: searchLocation,
            limit: 50
          }
        });
        
        if (error) throw error;
        if (data) {
          const response = data as JobScrapingResponse;
          if (response?.jobs?.length > 0) {
            return response;
          }
        }
      } catch (supabaseError) {
        console.warn('Supabase function failed, falling back to direct API call', supabaseError);
      }

      // Fallback to direct API call
      try {
        const apiUrl = new URL('/api/scrape-jobs', window.location.origin);
        apiUrl.searchParams.append('role', searchQuery);
        apiUrl.searchParams.append('location', searchLocation);
        
        const res = await fetch(apiUrl.toString());
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
        const response = await res.json() as JobScrapingResponse;
        
        if (response?.jobs?.length > 0) {
          return response;
        }
        
        // If we get here, API returned no results
        console.warn('No jobs found from API, using mock data');
        return this.getMockJobs(searchQuery, searchLocation);
      } catch (apiError) {
        console.error('API call failed, using mock data', apiError);
        return this.getMockJobs(searchQuery, searchLocation);
      }
    } catch (err) {
      console.error('Error in fetchJobsFromAPI:', err);
      return this.getMockJobs(query, location);
    }
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  private getMockJobs(query: string, location: string): JobScrapingResponse {
    // Return mock data structure that matches JobScrapingResponse
    return {
      jobs: [],
      total: 0,
      query,
      location,
      timestamp: this.getCurrentTimestamp(),
      success: false,
      error: 'Using mock data',
      sources: ['mock']
    };
  }

  async searchJobs(filters: {
    query?: string;
    location?: string;
    jobType?: string;
    remote?: boolean;
    experience?: string;
  } = {}): Promise<ScrapedJob[]> {
    try {
      const { query = 'software engineer', location = 'United States' } = filters;
      const response = await this.scrapeJobs(query, location);

      let jobs = response.jobs;

      if (filters.jobType && filters.jobType !== '') {
        jobs = jobs.filter(job => 
          job.jobType?.toLowerCase() === filters.jobType?.toLowerCase()
        );
      }

      if (filters.remote !== undefined) {
        jobs = jobs.filter(job => job.remote === filters.remote);
      }

      if (filters.experience && filters.experience !== '') {
        const experienceFilter = filters.experience.toLowerCase();
        jobs = jobs.filter(job => 
          job.experience?.toLowerCase().includes(experienceFilter) ?? false
        );
      }

      console.log(`Filtered ${response.jobs.length} jobs down to ${jobs.length} based on criteria`);
      return jobs;
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  }

  async getJobById(jobId: string): Promise<ScrapedJob | null> {
    try {
      // First try to find the job in any pending requests
      for (const [, promise] of this.pendingRequests.entries()) {
        const response = await promise;
        const job = response.jobs.find(j => j.id === jobId);
        if (job) return job;
      }

      // If not found in pending requests, try to fetch it
      const response = await this.scrapeJobs('', ''); // Empty query to get all jobs
      const job = response.jobs.find(j => j.id === jobId);
      return job || null;
    } catch (error) {
      console.error('Error getting job by ID:', error);
      return null;
    }
  }

  /**
   * Manually send email notification for existing jobs
   */
  async sendEmailNotification(jobs: ScrapedJob[], query?: string, location?: string): Promise<void> {
    try {
      const canSend = await jobEmailNotificationService.canSendNotification();
      if (canSend) {
        await jobEmailNotificationService.sendJobNotificationToUser(jobs, query, location);
        console.log(`Manual email notification sent for ${jobs.length} jobs`);
      } else {
        console.log('User not authenticated or no email available - cannot send email notification');
      }
    } catch (error) {
      console.error('Failed to send manual email notification:', error);
      throw error;
    }
  }
}

export const jobScrapingService = new JobScrapingService();