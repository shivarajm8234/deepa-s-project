import { useState } from 'react';
import { Briefcase, ExternalLink, MapPin, Clock, Building2, Search } from 'lucide-react';
import { useJobListings } from '../hooks/useJobListings';

interface JobListing {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  url: string;
  postedDate?: string;
  source: string;
}

export default function JobsPage() {
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const { jobs, loading, error, fetchJobs } = useJobListings();

  const countries = [
    { code: '', name: 'All Countries' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IN', name: 'India' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs({ role, country });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading Jobs...</h1>
            <p className="text-gray-500">Fetching the latest remote job listings</p>
          </div>
          <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Jobs</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchJobs({ role })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Remote Job Listings</h1>
          <p className="text-lg text-gray-600">Find your next remote opportunity from top job boards</p>

          <form onSubmit={handleSearch} className="mt-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Job Title or Keywords</label>
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Software Engineer, Designer, Marketing..."
                  className="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
              </div>
              <div className="w-full sm:w-64">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Search className="w-5 h-5 mr-2 -ml-1" />
                Find Jobs
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-500">
            <span className="inline-flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              {new Set(jobs.map((job: JobListing) => job.source)).size}+ Job Boards
            </span>
            <span className="mx-4">•</span>
            <span className="inline-flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              {jobs.length} Jobs
            </span>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job: JobListing, index: number) => {
            console.log('Job data:', job);
            return (
            <div key={`${job.company}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-2">{job.title}</h2>
                    <p className="text-blue-600 font-medium">{job.company}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {job.source}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{job.location || 'Remote'}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{job.salary}</span>
                    </div>
                  )}
                  {job.postedDate && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Posted {job.postedDate}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      console.log('Button clicked! Job URL:', job.url);
                      console.log('Full job object:', job);
                      if (job.url && job.url !== '#') {
                        console.log('Opening URL:', job.url);
                        window.open(job.url, '_blank', 'noopener,noreferrer');
                      } else {
                        console.log('No valid URL found');
                        alert('No job URL available');
                      }
                    }}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or check back later.</p>
            <button
              onClick={() => fetchJobs({ role, country })}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
