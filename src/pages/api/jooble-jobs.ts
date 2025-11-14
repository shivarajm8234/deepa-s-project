import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const JOOBLE_KEY = '5f032677-ea3c-452d-b003-c20c2ed65dee';
const JOOBLE_URL = 'https://jooble.org/api/' + JOOBLE_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { role = 'developer', location = '' } = req.query;
    
    const response = await axios.post(JOOBLE_URL, {
      keywords: role,
      location: location,
      page: 1,
      limit: 20
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Transform the response
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
    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
    
  } catch (error) {
    console.error('Jooble API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs from Jooble',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
