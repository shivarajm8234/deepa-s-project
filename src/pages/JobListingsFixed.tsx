import React, { useEffect, useState } from 'react';
import { 
  Briefcase, MapPin, Clock, Bookmark, 
  BookmarkCheck, ExternalLink, Search, Filter, X,
  RefreshCw, Building2
} from 'lucide-react';
import useJobStore, { Job, JobType } from '../stores/jobStore';

// Define a base job interface that both Job and ScrapedJob will extend
interface BaseJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  experience: string;
  type: 'government' | 'non-government';
  tags: string[];
  deadline: string;
  remote?: boolean;
}

interface ScrapedJob extends BaseJob {
  source: string;
  url: string;
  postedDate?: string;
  jobType?: string;
}

// Type guard for ScrapedJob
function isScrapedJob(job: Job | ScrapedJob): job is ScrapedJob {
  return 'source' in job && 'url' in job;
}

const JobListings: React.FC = () => {
  const { 
    filteredJobs = [], 
    isLoading, 
    error, 
    searchJobs, 
    loadScrapedJobs, 
    toggleSavedJob, 
    savedJobs = []
  } = useJobStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [jobType, setJobType] = useState<JobType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setLocalFilters] = useState({
    experience: '',
    salary: '',
    postedWithin: '',
    jobRole: ''
  });

  useEffect(() => {
    const initialLoad = async () => {
      await searchJobs({
        search: searchQuery,
        location: locationQuery,
        jobType,
        remote: false,
        experience: filters.experience || '',
        type: jobType as any
      });
    };
    initialLoad();
  }, [searchQuery, locationQuery, jobType]);

  const handleSearch = () => {
    searchJobs({
      search: searchQuery,
      location: locationQuery,
      jobType,
      remote: false,
      experience: filters.experience || '',
      type: jobType as any
    });
  };
  
  const handleRefresh = async () => {
    await loadScrapedJobs(searchQuery, locationQuery);
    await searchJobs({
      search: searchQuery,
      location: locationQuery,
      jobType,
      remote: false,
      experience: filters.experience || '',
      type: jobType as any
    });
  };
  
  const handleQuickSearch = (query: string, type: JobType = jobType) => {
    setSearchQuery(query);
    setJobType(type);
  };

  const governmentJobsCount = filteredJobs.filter(job => job.type === 'government').length;
  const privateJobsCount = filteredJobs.filter(job => job.type === 'non-government').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Job title, company, or keywords"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Location"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
            
            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickSearch('software engineer')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
              >
                Software Engineer
              </button>
              <button
                onClick={() => handleQuickSearch('web developer')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
              >
                Web Developer
              </button>
              <button
                onClick={() => {
                  setJobType('government');
                  handleQuickSearch('government job', 'government');
                }}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200"
              >
                Government Jobs
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'More Filters'}
              </button>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <select
                      id="experience"
                      value={filters.experience}
                      onChange={(e) => setLocalFilters({ ...filters, experience: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Any Experience</option>
                      <option value="fresher">Fresher</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                      Salary Range
                    </label>
                    <select
                      id="salary"
                      value={filters.salary}
                      onChange={(e) => setLocalFilters({ ...filters, salary: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Any Salary</option>
                      <option value="0-3">Up to 3 LPA</option>
                      <option value="3-6">3-6 LPA</option>
                      <option value="6-10">6-10 LPA</option>
                      <option value="10+">10+ LPA</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="postedWithin" className="block text-sm font-medium text-gray-700 mb-1">
                      Posted Within
                    </label>
                    <select
                      id="postedWithin"
                      value={filters.postedWithin}
                      onChange={(e) => setLocalFilters({ ...filters, postedWithin: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Any Time</option>
                      <option value="1">Last 24 hours</option>
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSearch}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {filteredJobs.length} jobs
              {governmentJobsCount > 0 && (
                <span> • {governmentJobsCount} government jobs</span>
              )}
              {privateJobsCount > 0 && (
                <span> • {privateJobsCount} private jobs</span>
              )}
            </div>
          </div>
        </div>

        {/* Job List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any jobs matching your current search criteria.
              </p>
              <div className="space-y-2 text-sm text-gray-600 text-left mb-6">
                <p>Try these suggestions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check your spelling or try different keywords</li>
                  <li>Broaden your search by removing some filters</li>
                  <li>Try searching for related job titles or skills</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLocationQuery('');
                  setJobType('all');
                  setLocalFilters({
                    experience: '',
                    salary: '',
                    postedWithin: '',
                    jobRole: ''
                  });
                  handleSearch();
                }}
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.location}
                            {isScrapedJob(job) && job.source && (
                              <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                {job.source}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleSavedJob(job.id)}
                        className="text-gray-400 hover:text-yellow-500"
                      >
                        {savedJobs.includes(job.id) ? (
                          <BookmarkCheck className="h-6 w-6 text-yellow-500" />
                        ) : (
                          <Bookmark className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.tags && job.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {job.experience && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.experience}
                        </span>
                      )}
                      {job.salary && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 text-right">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Posted 2 days ago</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save
                      </button>
                      <a
                        href={isScrapedJob(job) ? job.url : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Apply Now
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
