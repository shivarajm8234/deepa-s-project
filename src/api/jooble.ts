const JOOBLE_KEY = '5f032677-ea3c-452d-b003-c20c2ed65dee';
const JOOBLE_URL = 'https://jooble.org/api/' + JOOBLE_KEY;

export interface JobListing {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  date: string;
  source: string;
}

export const fetchJobs = async (role: string = 'developer'): Promise<JobListing[]> => {
  try {
    const response = await fetch(JOOBLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywords: role,
        page: 1,
        limit: 20
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch jobs');
    }

    const data = await response.json();
    
    return data.jobs?.map((job: any) => ({
      title: job.title || 'No title',
      company: job.company || 'Company not specified',
      location: job.location || 'Location not specified',
      description: job.snippet || '',
      url: job.link || '#',
      date: job.updated || new Date().toISOString(),
      source: 'Jooble'
    })) || [];
    
  } catch (error) {
    console.error('Error fetching jobs from Jooble:', error);
    throw new Error('Failed to fetch jobs from Jooble API');
  }
};
