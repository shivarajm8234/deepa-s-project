import { create } from 'zustand';
import { Job, JobType } from '../types/job';
import { jobScrapingService } from '../services/jobScrapingService';

export interface ScrapedJob {
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
  experience: string;
  type: 'government' | 'non-government';
  deadline: string;
}


interface Filters {
  query: string;
  location: string;
  type: JobType;
  experience: string;
  remote: boolean;
  tags: string[];
}

interface JobState {
  jobs: Job[];
  scrapedJobs: ScrapedJob[];
  filteredJobs: (Job | ScrapedJob)[];
  savedJobs: string[];
  filters: Filters;
  isLoading: boolean;
  error: string | null;
  lastUpdated?: string;
  loadScrapedJobs: (query?: string, location?: string) => Promise<ScrapedJob[]>;
  toggleSavedJob: (jobId: string) => void;
  clearError: () => void;
  setFilters: (filters: Partial<Filters>) => void;
  searchJobs: (filters: Partial<Filters>) => void;
}

const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  scrapedJobs: [],
  filteredJobs: [],
  savedJobs: [],
  filters: {
    query: '',
    location: '',
    type: 'all',
    experience: '',
    remote: false,
    tags: []
  },
  isLoading: false,
  error: null,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  toggleSavedJob: (jobId) =>
    set((state) => ({
      savedJobs: state.savedJobs.includes(jobId)
        ? state.savedJobs.filter((id) => id !== jobId)
        : [...state.savedJobs, jobId],
    })),

  clearError: () => set({ error: null }),

  loadScrapedJobs: async (query = 'software engineer', location = 'Bangalore'): Promise<ScrapedJob[]> => {
    set({ isLoading: true, error: null });
    console.log('Loading scraped jobs with query:', query, 'location:', location);
    
    try {
      const response = await jobScrapingService.scrapeJobs(query, location);
      
      if (!response) {
        throw new Error('No response received from the job service');
      }
      
      console.log(`Received ${response.jobs?.length || 0} jobs from service`, response);
      
      if (!response.jobs || response.jobs.length === 0) {
        console.warn('No jobs found in the response');
        set({ 
          isLoading: false,
          scrapedJobs: [],
          filteredJobs: []
        });
        return [];
      }

      // Process jobs with default values
      const processedJobs: ScrapedJob[] = response.jobs.map((job: any) => {
        // Log the raw job data for debugging
        console.log('Processing job:', job);
        
        return {
          id: job.id || `job-${Math.random().toString(36).substr(2, 9)}`,
          title: job.title || 'Untitled Position',
          company: job.company || 'Company not specified',
          location: job.location || 'Location not specified',
          description: job.description || 'No description available',
          url: job.url || job.applyUrl || '#',
          source: job.source || 'Unknown Source',
          postedDate: job.postedDate || job.createdAt || new Date().toISOString(),
          jobType: job.jobType || job.type || 'Full-time',
          salary: job.salary || job.compensation || 'Not specified',
          remote: job.remote || job.workplaceType === 'remote' || false,
          tags: Array.isArray(job.tags) ? job.tags : 
               job.skills ? job.skills.split(',').map((s: string) => s.trim()) : [],
          type: (job.type === 'government' || job.jobType === 'government') ? 'government' : 'non-government',
          experience: job.experience || job.experienceLevel || 'Not specified',
          deadline: job.deadline || job.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      });
      
      console.log('Processed jobs:', processedJobs);
      
      // Update the store with the new jobs
      set(state => ({
        scrapedJobs: processedJobs,
        filteredJobs: processedJobs, // Also update filtered jobs
        isLoading: false,
        lastUpdated: new Date().toISOString(),
        error: null,
        filters: {
          ...state.filters,
          query: query,
          location: location
        }
      }));
      
      return processedJobs;
    } catch (error) {
      console.error('Error loading scraped jobs:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load jobs',
        isLoading: false 
      });
      
      // Return empty array to prevent further errors
      return [];
    }
  },

  searchJobs: async (filters: Partial<Filters>) => {
    set({ isLoading: true });
    try {
      const { query = 'software engineer', location = 'United States', type = 'all', remote = false, experience = '' } = filters;
      
      // Load jobs from the scraping service
      const scrapedJobs = await get().loadScrapedJobs(query, location);
      
      // Filter jobs based on the provided filters
      const filtered = scrapedJobs.filter(job => {
        if (!job) return false;
        
        const matchesSearch = !query || 
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase()) ||
          (job.tags && job.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));
          
        const matchesLocation = !location || 
          job.location.toLowerCase().includes(location.toLowerCase());
          
        const matchesType = type === 'all' || job.type === type;
        const matchesRemote = !remote || job.remote === true;
        const matchesExperience = !experience || 
          (job.experience && job.experience.toLowerCase().includes(experience.toLowerCase()));
          
        return matchesSearch && matchesLocation && matchesType && matchesRemote && matchesExperience;
      });

      set(state => ({
        filteredJobs: filtered,
        isLoading: false,
        filters: {
          ...state.filters,
          query: query,
          location: location,
          type: type as JobType,
          remote: remote,
          experience: experience,
          tags: []
        }
      }));
    } catch (error) {
      console.error('Error searching jobs:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to search jobs',
        isLoading: false
      });
    }
  },
}));

export default useJobStore;