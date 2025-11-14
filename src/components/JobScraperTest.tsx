import { useEffect, useState } from 'react';
import { jobScrapingService, ScrapedJob } from '../services/jobScrapingService';

const JobScraperTest = () => {
  const [jobs, setJobs] = useState<ScrapedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('software engineer');
  const [location, setLocation] = useState('Remote');

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobScrapingService.scrapeJobs(query, location);
      setJobs(response.jobs);
      console.log('Jobs fetched successfully:', response);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Job Scraper Test</h1>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Software Engineer"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Remote"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Loading...' : 'Search Jobs'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Results ({jobs.length} jobs)</h2>
        {jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{job.title}</h3>
                    <p className="text-gray-600">{job.company} • {job.location}</p>
                    {job.jobType && <span className="text-sm text-gray-500">{job.jobType}</span>}
                    {job.tags && job.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  >
                    Apply
                  </a>
                </div>
                {job.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                )}
                <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                  <span>Posted: {new Date(job.postedDate || '').toLocaleDateString()}</span>
                  {job.deadline && (
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {jobs.length === 0 && !loading && !error && (
          <p className="text-gray-500">No jobs found. Try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default JobScraperTest;
