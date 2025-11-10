import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

type Job = {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  date: string;
  source: string;
};

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    role: '',
    location: '',
  });

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const query = new URLSearchParams({
        role: searchParams.role || 'developer',
        ...(searchParams.location && { location: searchParams.location }),
      }).toString();

      const response = await fetch(`/api/jooble-jobs?${query}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch jobs');
      }
      
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we're on the client side and have search parameters
    if (typeof window !== 'undefined' && (router.query.role || router.query.location)) {
      setSearchParams({
        role: (router.query.role as string) || '',
        location: (router.query.location as string) || '',
      });
      fetchJobs();
    }
  }, [router.query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: '/jobs',
      query: {
        ...(searchParams.role && { role: searchParams.role }),
        ...(searchParams.location && { location: searchParams.location }),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Head>
        <title>Job Search | Find Your Next Opportunity</title>
        <meta name="description" content="Search for job opportunities" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Find Your Dream Job</h1>
        
        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:flex md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="role"
                value={searchParams.role}
                onChange={(e) => setSearchParams({...searchParams, role: e.target.value})}
                placeholder="e.g. Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location (Optional)
              </label>
              <input
                type="text"
                id="location"
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                placeholder="e.g. New York"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
              </h2>
            </div>

            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                          <a href={job.url} target="_blank" rel="noopener noreferrer">
                            {job.title}
                          </a>
                        </h3>
                        <p className="text-gray-700 mt-1">{job.company}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.source}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location || 'Remote'}
                      </p>
                      <p className="mt-1 text-gray-500 text-xs">
                        Updated: {new Date(job.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div 
                      className="mt-3 text-gray-700 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                    
                    <div className="mt-4">
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Job
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && jobs.length === 0 && router.query.role && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}

        {!loading && !router.query.role && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Search for jobs</h3>
            <p className="mt-1 text-gray-500">Enter a job title and location to find matching opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
}
