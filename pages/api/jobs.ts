import type { IncomingMessage, ServerResponse } from 'http';
import { ScraperService } from '../../../app/scrapers/scraperService';
import { URL } from 'url';
import axios from 'axios';

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  try {
    // Parse query parameters from the request URL
    const requestUrl = new URL(req.url || '', `http://${req.headers.host}`);
    const role = requestUrl.searchParams.get('role') || undefined;
    const location = requestUrl.searchParams.get('location') || undefined;

    // Jooble API configuration
    const JOOBLE_KEY = '5f032677-ea3c-452d-b003-c20c2ed65dee';
    const JOOBLE_URL = 'https://jooble.org/api/' + JOOBLE_KEY;
    
    // Prepare request data
    const requestData = {
      keywords: role || 'it',
      location: location || '',
      page: 1,
      limit: 20
    };

    // Call Jooble API
    const response = await axios.post(JOOBLE_URL, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Transform the response to match your existing format if needed
    const jobs = response.data.jobs.map((job: any) => ({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.snippet,
      url: job.link,
      date: job.updated,
      source: 'Jooble'
    }));
    
    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      jobs,
      message: `Successfully retrieved ${jobs.length} jobs from Jooble.`
    }));
  } catch (error) {
    console.error('Error in jobs API:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      message: 'Error fetching jobs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
  }
}
