import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Helper to create CORS response
const createCorsResponse = (status: number, body: any = null) => {
  if (body) {
    return new Response(JSON.stringify(body), {
      status,
      headers: corsHeaders
    });
  }
  
  return new Response(null, {
    status,
    headers: corsHeaders
  });
};

interface JobListing {
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

// Helper functions for job data generation
const generateTags = (): string[] => {
  const tags = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
    'Git', 'MongoDB', 'Remote', 'Full-time', 'Part-time', 'Contract', 'Freelance'
  ];
  return tags.sort(() => 0.5 - Math.random()).slice(0, 5);
};

const generateExperienceLevel = (): string => {
  const levels = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'];
  return levels[Math.floor(Math.random() * levels.length)];
};

const generateDeadline = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 7);
  return date.toISOString().split('T')[0];
};

// Scrape jobs from Glassdoor
async function scrapeGlassdoorJobs(query: string, location: string, limit: number = 10): Promise<JobListing[]> {
  const jobs: JobListing[] = [];
  console.log(`[Glassdoor] Starting to scrape jobs for query: "${query}" in location: "${location}"`);
  
  try {
    const searchQuery = encodeURIComponent(query);
    const locationQuery = encodeURIComponent(location);
    
    const url = `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${searchQuery}&locT=C&locId=1154532&locKeyword=${locationQuery}&jobType=all&fromAge=1&minSalary=0&includeNoSalaryJobs=true&radius=100&cityId=-1&minRating=0.0&industryId=-1&sgocId=-1&companyId=-1&employerSizes=0&applicationType=0&remoteWorkType=0`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('.react-job-listing').each((i, element) => {
      if (i >= limit) return false;
      
      const title = $(element).find('.job-title').text().trim();
      const company = $(element).find('.employer-name').text().trim();
      const location = $(element).find('.location').text().trim();
      const salary = $(element).find('.salaryText').text().trim() || 'Not specified';
      const description = $(element).find('.job-description').text().trim() || 'No description available';
      const jobUrl = `https://www.glassdoor.com${$(element).find('a.jobLink').attr('href') || ''}`;
      
      jobs.push({
        id: `glassdoor-${i}-${Date.now()}`,
        title,
        company,
        location,
        salary,
        description,
        url: jobUrl,
        source: 'Glassdoor',
        jobType: 'Full-time',
        remote: title.toLowerCase().includes('remote') || location.toLowerCase().includes('remote'),
        tags: [query.toLowerCase(), ...(title.toLowerCase().includes('senior') ? ['senior'] : [])],
        type: 'non-government',
        experience: generateExperienceLevel(),
        deadline: generateDeadline(),
      });
    });
    
  } catch (error) {
    console.error('Error scraping Glassdoor:', error);
  }
  
  return jobs;
}

// Scrape jobs from Naukri
async function scrapeNaukriJobs(query: string, location: string, limit: number = 10): Promise<JobListing[]> {
  const jobs: JobListing[] = [];
  console.log(`[Naukri] Starting to scrape jobs for query: "${query}" in location: "${location}"`);
  
  try {
    const searchQuery = encodeURIComponent(query);
    const locationQuery = encodeURIComponent(location);
    
    const url = `https://www.naukri.com/jobs-in-${locationQuery.toLowerCase().replace(/\s+/g, '-')}?k=${searchQuery}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('.jobTuple').each((i, element) => {
      if (i >= limit) return false;
      
      const title = $(element).find('.title').text().trim();
      const company = $(element).find('.companyName').text().trim();
      const location = $(element).find('.location').text().trim();
      const salary = $(element).find('.salary').text().trim() || 'Not specified';
      const description = $(element).find('.job-description').text().trim() || 'No description available';
      const jobUrl = $(element).find('a.title').attr('href') || '';
      
      jobs.push({
        id: `naukri-${i}-${Date.now()}`,
        title,
        company,
        location,
        salary,
        description,
        url: jobUrl,
        source: 'Naukri',
        jobType: 'Full-time',
        remote: title.toLowerCase().includes('remote'),
        tags: [query.toLowerCase(), ...(title.toLowerCase().includes('senior') ? ['senior'] : [])],
        type: 'non-government',
        experience: generateExperienceLevel(),
        deadline: generateDeadline(),
      });
    });
    
  } catch (error) {
    console.error('Error scraping Naukri:', error);
  }
  
  return jobs;
}

// Scrape jobs from multiple sources
async function scrapeAllJobBoards(query: string, location: string, limit: number = 10): Promise<{jobs: JobListing[], sources: string[]}> {
  const jobs: JobListing[] = [];
  const sources = new Set<string>();
  
  // Scrape from multiple sources in parallel
  const results = await Promise.allSettled([
    scrapeLinkedInJobs(query, location, Math.ceil(limit / 4)),
    scrapeIndeedJobs(query, location, Math.ceil(limit / 4)),
    scrapeGlassdoorJobs(query, location, Math.ceil(limit / 4)),
    scrapeNaukriJobs(query, location, Math.ceil(limit / 4))
  ]);

  // Process results
  results.forEach((result, index) => {
    const source = ['LinkedIn', 'Indeed', 'Glassdoor', 'Naukri'][index];
    if (result.status === 'fulfilled' && result.value.length > 0) {
      jobs.push(...result.value);
      sources.add(source);
      console.log(`[${source}] Successfully scraped ${result.value.length} jobs`);
    } else {
      console.error(`[${source}] Failed to scrape jobs:`, 
        result.status === 'rejected' ? result.reason : 'No results');
    }
  });

  // Remove duplicates based on job title and company
  const uniqueJobs = Array.from(new Map(
    jobs.map(job => [`${job.title}-${job.company}`, job])
  ).values());

  return {
    jobs: uniqueJobs.slice(0, limit),
    sources: Array.from(sources)
  };
}

// Scrape jobs from LinkedIn
async function scrapeLinkedInJobs(query: string, location: string, limit: number = 10): Promise<JobListing[]> {
  const jobs: JobListing[] = [];
  console.log(`[LinkedIn] Starting to scrape jobs for query: "${query}" in location: "${location}"`);
  try {
    // Encode search parameters for URL
    const searchQuery = encodeURIComponent(query);
    const locationQuery = encodeURIComponent(location);
    
    // Construct the LinkedIn jobs search URL
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${searchQuery}&location=${locationQuery}&f_TPR=r86400&start=0&count=${limit}`;
    
    // Make the request with appropriate headers to mimic a browser
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    
    if (!response.ok) {
      console.error('LinkedIn API error:', response.statusText);
      return [];
    }
    
    const html = await response.text();
    // Parse the HTML response to extract job listings
    // Note: This is a simplified example. You might need to adjust the selectors based on LinkedIn's HTML structure
    const $ = cheerio.load(html);
    
    $('.base-card').each((i, elem) => {
      const title = $(elem).find('.base-search-card__title').text().trim();
      const company = $(elem).find('.base-search-card__subtitle').text().trim();
      const location = $(elem).find('.job-search-card__location').text().trim();
      const url = $(elem).find('a.base-card__full-link').attr('href') || '';
      
      if (title && company) {
        jobs.push({
          id: `linkedin-${i}-${Date.now()}`,
          title,
          company,
          location,
          description: 'Job description available on LinkedIn',
          url,
          postedDate: new Date().toISOString(),
          tags: [],
          experienceLevel: 'Not specified',
          deadline: generateDeadline(),
          source: 'LinkedIn'
        });
      }
    });
    
  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
  }
  
  return jobs;
}

// Scrape jobs from Indeed
async function scrapeIndeedJobs(query: string, location: string, limit: number = 10): Promise<JobListing[]> {
  const jobs: JobListing[] = [];
  console.log(`[Indeed] Starting to scrape jobs for query: "${query}" in location: "${location}"`);
  try {
    const searchQuery = encodeURIComponent(query);
    const locationQuery = encodeURIComponent(location);
    
    const url = `https://www.indeed.com/jobs?q=${searchQuery}&l=${locationQuery}&limit=${limit}&fromage=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    
    if (!response.ok) {
      console.error('Indeed API error:', response.statusText);
      return [];
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('.job_seen_beacon').each((i, elem) => {
      const title = $(elem).find('h2.jobTitle').text().trim();
      const company = $(elem).find('.companyName').text().trim();
      const location = $(elem).find('.companyLocation').text().trim();
      const url = new URL($(elem).find('a.jcs-JobTitle').attr('href') || '', 'https://www.indeed.com').toString();
      
      if (title && company) {
        jobs.push({
          id: `indeed-${i}-${Date.now()}`,
          title,
          company,
          location,
          description: 'Job description available on Indeed',
          url,
          postedDate: new Date().toISOString(),
          tags: [],
          experienceLevel: 'Not specified',
          deadline: generateDeadline(),
          source: 'Indeed'
        });
      }
    });
    
  } catch (error) {
    console.error('Error scraping Indeed:', error);
  }
  
  return jobs;
}

// Main request handler
const handler = async (req: Request): Promise<Response> => {
  // Log the incoming request for debugging
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return createCorsResponse(204);
  }

  // Handle non-POST requests
  if (req.method !== 'POST') {
    return createCorsResponse(405, { error: 'Method not allowed' });
  }

  try {
    // Parse the request body
    const requestBody = await req.json();
    const { query = 'software engineer', location = 'United States', limit = 10 } = requestBody;

    // Scrape jobs from multiple sources in parallel
    console.log(`Starting job search for "${query}" in "${location}" with limit ${limit}`);
    
    const [linkedInJobs, indeedJobs] = await Promise.allSettled([
      scrapeLinkedInJobs(query, location, Math.ceil(limit / 2)),
      scrapeIndeedJobs(query, location, Math.ceil(limit / 2))
    ]);
    
    // Handle settled promises
    const successfulJobs: JobListing[] = [];
    const errors: string[] = [];
    
    if (linkedInJobs.status === 'fulfilled') {
      console.log(`[LinkedIn] Successfully scraped ${linkedInJobs.value.length} jobs`);
      successfulJobs.push(...linkedInJobs.value);
    } else {
      console.error('[LinkedIn] Error scraping jobs:', linkedInJobs.reason);
      errors.push('LinkedIn: ' + (linkedInJobs.reason?.message || 'Unknown error'));
    }
    
    if (indeedJobs.status === 'fulfilled') {
      console.log(`[Indeed] Successfully scraped ${indeedJobs.value.length} jobs`);
      successfulJobs.push(...indeedJobs.value);
    } else {
      console.error('[Indeed] Error scraping jobs:', indeedJobs.reason);
      errors.push('Indeed: ' + (indeedJobs.reason?.message || 'Unknown error'));
    }
    
    // Limit the number of jobs and get unique sources
    const allJobs = successfulJobs.slice(0, limit);
    const sources = Array.from(new Set(successfulJobs.map(job => job.source)));

    // Return the response
    return createCorsResponse(200, {
      success: true,
      count: allJobs.length,
      jobs: allJobs,
      sources,
      total: allJobs.length,
      query: query,
      location: location,
      timestamp: new Date().toISOString(),
      fromCache: false
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return createCorsResponse(500, {
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};

// Start the server
serve(handler);
