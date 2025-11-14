import React, { useEffect, useState } from 'react';
// Removed Link import since we no longer use View Details
import { 
  Briefcase, MapPin, Clock, DollarSign, Bookmark, 
  BookmarkCheck, ExternalLink, Search, Filter, X,
  RefreshCw, Globe, Building2, Users, Award, Shield, Zap
} from 'lucide-react';
import useJobStore, { ScrapedJob } from '../stores/jobStore';
import { Job, JobType } from '../types/job';

// Type guard for ScrapedJob
function isScrapedJob(job: Job | ScrapedJob): job is ScrapedJob {
  return 'source' in job && 'url' in job;
}

const JobListings: React.FC = () => {
  const { 
    filteredJobs = [], 
    scrapedJobs = [],
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
        query: searchQuery,
        location: locationQuery,
        type: jobType,
        remote: false,
        experience: ''
      });
    };
    initialLoad();
  }, [searchQuery, locationQuery, jobType]);

  const handleSearch = () => {
    searchJobs({
      query: searchQuery,
      location: locationQuery,
      type: jobType,
      remote: false,
      experience: filters.experience || ''
    });
  };
  
  const handleRefresh = async () => {
    await loadScrapedJobs(searchQuery, locationQuery);
    await searchJobs({
      query: searchQuery,
      location: locationQuery,
      type: jobType,
      remote: false,
      experience: filters.experience || ''
    });
  };
  
  const handleQuickSearch = (query: string, type: JobType = jobType) => {
    setSearchQuery(query);
    setJobType(type);
    searchJobs({
      query: query,
      location: locationQuery,
      type: type,
      remote: false,
      experience: filters.experience || ''
    });
  };

  const governmentJobsCount = filteredJobs.filter((job: Job | ScrapedJob) => 'type' in job && job.type === 'government').length;
  const privateJobsCount = filteredJobs.filter((job: Job | ScrapedJob) => 'type' in job && job.type === 'non-government').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {filteredJobs.length} jobs
                </span>
                {scrapedJobs.length > 0 && (
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                    {scrapedJobs.length} from web
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{/* uniqueSources.length */} active sources</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Cache: {/* cacheStats.memoryEntries */} in memory</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Govt: {governmentJobsCount} | Private: {privateJobsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Job title, company, or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Location (e.g., Mumbai, Remote)"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Filters'}
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
                {/* Other filter inputs... */}
              </div>
            </div>
          )}
        </div>

        {/* Quick Search Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleQuickSearch('software engineer', 'all')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
          >
            Software Engineer
          </button>
          <button
            onClick={() => handleQuickSearch('data scientist', 'all')}
            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
          >
            Data Scientist
          </button>
          <button
            onClick={() => handleQuickSearch('product manager', 'all')}
            className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors"
          >
            Product Manager
          </button>
          <button
            onClick={() => handleQuickSearch('ux designer', 'all')}
            className="px-3 py-1 text-sm bg-pink-100 text-pink-800 rounded-full hover:bg-pink-200 transition-colors"
          >
            UX Designer
          </button>
          <button
            onClick={() => handleQuickSearch('', 'government')}
            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
          >
            Government Jobs
          </button>
          <button
            onClick={() => handleQuickSearch('remote', 'non-government')}
            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors"
          >
            Remote Jobs
          </button>
        </div>

        {/* Job Listings */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <Globe className="w-6 h-6 text-orange-500" />
              <Shield className="w-6 h-6 text-green-500" />
              <Zap className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-gray-600 mb-2">Loading job listings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {job.company && (
                          <span className="text-gray-700">{job.company}</span>
                        )}
                        {job.location && (
                          <span className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center text-sm text-gray-500">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {job.salary}
                          </span>
                        )}
                        {job.deadline && (
                          <span className="flex items-center text-sm text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            Apply by: {job.deadline}
                          </span>
                        )}
                      </div>
                      
                      {job.type === 'government' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Government Job
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Private Sector
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => toggleSavedJob(job.id)}
                        className={`p-2 rounded-full ${
                          savedJobs.includes(job.id) 
                            ? 'text-yellow-500 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-500'
                        }`}
                      >
                        {savedJobs.includes(job.id) ? (
                          <BookmarkCheck className="w-5 h-5" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {job.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isScrapedJob(job) && job.source && (
                        <span className="text-xs text-gray-500">Source: {job.source}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isScrapedJob(job) && job.url && job.url !== '#' ? (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Apply
                          <ExternalLink className="ml-1 w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-400 bg-gray-100 cursor-not-allowed"
                        >
                          No Link Available
                        </button>
                      )}
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
