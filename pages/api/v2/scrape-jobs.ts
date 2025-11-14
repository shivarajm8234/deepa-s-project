import { IncomingMessage, ServerResponse } from 'http';
import { ScraperService } from '../../../../app/scrapers/newScraperService';

const scraperService = new ScraperService({
  rateLimit: 2000, // 2 seconds between requests
  maxRetries: 3,
  requestTimeout: 30000 // 30 seconds
});

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  try {
    // Parse query parameters
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const role = url.searchParams.get('role') || undefined;
    const location = url.searchParams.get('location') || undefined;
    const sources = url.searchParams.get('sources')?.split(',') || undefined;

    console.log(`[API] Scraping jobs with role: ${role || 'any'}, location: ${location || 'any'}, sources: ${sources?.join(', ') || 'all'}`);

    // Scrape jobs
    let jobs;
    if (sources && sources.length > 0) {
      jobs = await scraperService.scrapeFromSources(sources, role, location);
    } else {
      jobs = await scraperService.scrapeAll(role, location);
    }

    // Send response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      success: true,
      count: jobs.length,
      data: jobs,
      message: `Successfully scraped ${jobs.length} jobs`
    }));

  } catch (error) {
    console.error('Error in jobs API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      success: false,
      error: errorMessage,
      message: 'Error fetching jobs'
    }));
  }
}
