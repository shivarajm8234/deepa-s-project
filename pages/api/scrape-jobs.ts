import type { IncomingMessage, ServerResponse } from 'http';
import { ScraperService } from '../../../app/scrapers/newScraperService';
import { URL } from 'url';

interface JobListing {
  id?: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  salary?: string;
  description?: string;
  postedDate?: string;
  jobType?: string[];
  skills?: string[];
  experienceLevel?: string;
}

// Helper function to parse the request body
async function parseRequestBody(req: IncomingMessage): Promise<{ role?: string; location?: string; limit?: number }> {
  return new Promise((resolve) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const data = body ? JSON.parse(body) : {};
          resolve({
            role: data.query || data.role,
            location: data.location,
            limit: data.limit || 50
          });
        } catch (error) {
          console.error('Error parsing request body:', error);
          resolve({});
        }
      });
    } else {
      resolve({});
    }
  });
}

// Cache for storing scraped jobs (in-memory, consider using Redis in production)
const jobCache = new Map<string, { jobs: JobListing[]; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

// Helper function to get the cache key
function getCacheKey(role?: string, location?: string): string {
  return `${role || 'all'}-${location || 'any'}`;
}

export const handler = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    let role: string | undefined;
    let location: string | undefined;
    let limit = 50;
    
    if (req.method === 'GET') {
      // Handle GET request with query parameters
      const requestUrl = new URL(req.url || '', `http://${req.headers.host}`);
      role = requestUrl.searchParams.get('role') || undefined;
      location = requestUrl.searchParams.get('location') || undefined;
      const limitParam = requestUrl.searchParams.get('limit');
      if (limitParam && !isNaN(Number(limitParam))) {
        limit = Math.min(100, Math.max(1, Number(limitParam))); // Limit to 1-100
      }
    } else if (req.method === 'POST') {
      // Handle POST request with JSON body
      const body = await parseRequestBody(req);
      role = body.role;
      location = body.location;
      if (body.limit) {
        limit = Math.min(100, Math.max(1, body.limit));
      }
    } else {
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, POST, OPTIONS');
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: false,
        message: 'Method not allowed. Use GET, POST, or OPTIONS.' 
      }));
      return;
    }

    // Check cache first
    const cacheKey = getCacheKey(role, location);
    const cached = jobCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      // Return cached results
      const jobs = cached.jobs.slice(0, limit);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: true,
        jobs: jobs,
        total: jobs.length,
        cached: true,
        timestamp: new Date().toISOString(),
        message: `Returned ${jobs.length} cached jobs.`
      }));
      return;
    }

    try {
      // Perform live scraping
      const scraperService = new ScraperService();
      const jobs = await scraperService.scrapeAll(role, location);
      
      // Update cache
      jobCache.set(cacheKey, {
        jobs,
        timestamp: Date.now()
      });
      
      // Apply limit
      const limitedJobs = jobs.slice(0, limit);
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: true,
        jobs: limitedJobs,
        total: limitedJobs.length,
        cached: false,
        timestamp: new Date().toISOString(),
        message: `Successfully scraped ${limitedJobs.length} jobs.`
      }));
    } catch (error) {
      console.error('Error during scraping:', error);
      
      // If we have stale cache, return it with a warning
      if (cached) {
        const jobs = cached.jobs.slice(0, limit);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          success: true,
          jobs: jobs,
          total: jobs.length,
          cached: true,
          stale: true,
          error: 'Using cached results due to scraping error',
          timestamp: new Date().toISOString(),
          message: `Returned ${jobs.length} stale cached jobs due to error.`
        }));
        return;
      }
      
      // No cache available, return error
      throw error;
    }
  } catch (error) {
    console.error('Error in jobs API:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      success: false,
      message: 'Error fetching jobs',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }));
  }
}
