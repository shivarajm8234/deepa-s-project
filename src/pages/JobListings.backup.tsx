import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search, 
  Filter,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  AlertCircle,
  Database,
  Zap,
  Globe,
  Building2,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Shield,
  GraduationCap
} from 'lucide-react';
import useJobStore from '../stores/jobStore';
import { jobScrapingService, ScrapedJob } from '../services/jobScrapingService';
import { Job } from '../types/job';

// Extend the Job interface to include all possible properties
type JobListing = Job | ScrapedJob;

// Type guard to check if a job has ScrapedJob properties
function isScrapedJob(job: JobListing): job is ScrapedJob {
  return 'source' in job && 'url' in job;
}

// Type guard to check if a job has applicationDeadline
function hasApplicationDeadline(job: JobListing): job is JobListing & { applicationDeadline: string } {
  return 'applicationDeadline' in job && job.applicationDeadline !== undefined;
}

// Type guard to check if a job has examDate
function hasExamDate(job: JobListing): job is JobListing & { examDate: string } {
  return 'examDate' in job && job.examDate !== undefined;
}

// Type guard to check if a job has eligibility
function hasEligibility(job: JobListing): job is JobListing & { eligibility: string } {
  return 'eligibility' in job && job.eligibility !== undefined;
}

const JobListings: React.FC = () => {
  const { 
    jobs, 
    scrapedJobs, 
    filters, 
    savedJobs, 
    isLoading, 
    error,
    setFilters, 
    toggleSavedJob, 
    loadScrapedJobs,
    searchJobs,
    clearError 
  } = useJobStore();
  
  // Combine jobs and scrapedJobs into a single array with proper typing
  const allJobs: JobListing[] = [...jobs, ...scrapedJobs];

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('software engineer');
  const [locationQuery, setLocationQuery] = useState('India');
  const [jobType, setJobType] = useState<'all' | 'government' | 'non-government'>('all');
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);

  // Load scraped jobs on component mount
  useEffect(() => {
    const initialLoad = async () => {
      await loadScrapedJobs(searchQuery, locationQuery);
      setLastSearchTime(new Date());
    };
    initialLoad();
  }, []);

  // Filter jobs based on current filters
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch = !filters.search ||  
      (job.title && job.title.toLowerCase().includes(filters.search.toLowerCase())) ||
      (job.company && job.company.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesType = !filters.type || job.type === filters.type;
    
    return matchesSearch && matchesType;
  });

  const handleSearch = () => {
    setIsInitialLoad(false);
    setLastSearchTime(new Date());
  };

  const handleJobTypeChange = (type: 'all' | 'government' | 'non-government') => {
    setFilters(prev => ({
      ...prev,
      jobType: type
    }));
    setLastSearchTime(new Date());
  };

  const handleRefresh = () => {
    setLastSearchTime(undefined);
    setLastSearchTime(new Date());
  };

  const handleQuickSearch = async (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      jobType: 'all',
      location: ''
    }));
    const newFilters = {
      ...filters,
      search: query,
      location: locationQuery,
    };
    setFilters(newFilters);
    await searchJobs(newFilters);
    setLastSearchTime(new Date());
  };

  const cacheStats = jobScrapingService.getCacheStats();
  const scrapedJobsCount = scrapedJobs.length;
  const uniqueSources = [...new Set(scrapedJobs.map((job: ScrapedJob) => job.source))];

  // Comprehensive Indian job portals
  const indianJobPortals = [
    'Naukri.com', 'Indeed India', 'LinkedIn Jobs', 'Monster India', 
    'TimesJobs', 'Shine.com', 'Freshersworld', 'WorkIndia', 
    'Instahyre', 'CutShort', 'Apna'
  ];

  const governmentPortals = [
    'NCS Portal', 'SSC Portal', 'UPSC Portal', 'IBPS Portal', 
    'RRB Portal', 'DRDO Careers', 'ISRO Careers', 'BHEL Careers',
    'Sarkari Result', 'Employment News', 'State PSC Portals'
  ];

  const governmentJobsCount = scrapedJobs.filter((job: ScrapedJob) => job.type === 'government').length;
  const privateJobsCount = scrapedJobs.filter((job: ScrapedJob) => job.type === 'non-government').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                {filteredJobs.length} jobs
              </span>
              {scrapedJobsCount > 0 && (
                <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {scrapedJobsCount} live jobs
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh Jobs
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
          
                  {/* Quick Search Buttons */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Quick search:</span>
              {['Software', 'Engineering', 'Design', 'Marketing', 'Sales'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
              <button
                onClick={() => setFilters({
                  jobType: 'all',
                  location: '',
                  experience: '',
                  remote: false,
                  salary: ''
                })}
                className="px-4 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <Globe className="w-6 h-6 text-orange-500" />
              <Shield className="w-6 h-6 text-green-500" />
              <Zap className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-gray-600 mb-2">Scraping comprehensive job listings from Indian portals...</p>
            <p className="text-sm text-gray-500">Fetching from private sector & government job portals across India</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="space-y-4">
                    {/* Job Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {job.type === 'government' ? (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  Government
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  Private
                                </span>
                              )}
                              {isScrapedJob(job) && (
                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                  {job.source}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Last updated: {lastSearchTime?.toLocaleTimeString() || 'Never'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>{uniqueSources.length} active sources</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Cache: {cacheStats.memoryEntries} in memory</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Govt: {governmentJobsCount} | Private: {privateJobsCount}</span>
          </div>
        </div>
      </div>

      {/* Quick Search Buttons for Indian Job Market */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm font-medium text-gray-700 py-2">Popular searches in India:</span>
        {[
          'Software Engineer', 'Data Scientist', 'Product Manager', 'Business Analyst', 
          'Full Stack Developer', 'DevOps Engineer', 'UI/UX Designer', 'Digital Marketing',
          'Sales Executive', 'HR Manager', 'Finance Analyst', 'Content Writer',
          'Government Jobs', 'Banking Jobs', 'Railway Jobs', 'Civil Services'
        ].map(query => (
          <button
            key={query}
            onClick={() => handleQuickSearch(query)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              query.includes('Government') || query.includes('Banking') || query.includes('Railway') || query.includes('Civil')
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
            }`}
          >
            {query}
          </button>
        ))}
      </div>

      {/* Job Type Toggle */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleJobTypeChange('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              jobType === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => handleJobTypeChange('non-government')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              jobType === 'non-government' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Private Sector
          </button>
          <button
            onClick={() => handleJobTypeChange('government')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              jobType === 'government' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Government Jobs
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title or Company
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. Software Engineer, TCS, Government Jobs"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              id="location"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="India">All India</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Noida">Noida</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'Searching...' : 'Search Jobs'}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="government">Government</option>
                <option value="non-government">Private Sector</option>
              </select>
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                id="experience"
                value={filters.experience}
                onChange={(e) => setFilters({ experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                <option value="fresher">Fresher</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-8">5-8 years</option>
                <option value="8+">8+ years</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remote"
                checked={filters.remote}
                onChange={(e) => setFilters({ remote: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                Remote/Work from Home
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <Globe className="w-6 h-6 text-orange-500" />
            <Shield className="w-6 h-6 text-green-500" />
            <Zap className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-gray-600 mb-2">Scraping comprehensive job listings from Indian portals...</p>
          <p className="text-sm text-gray-500">Fetching from private sector & government job portals across India</p>
        </div>
      ) : null}

      {/* Job Listings */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
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
                  {job.type === 'government' ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Government
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Private
                    </span>
                  )}
                  {isScrapedJob(job) && (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {job.type === 'government' ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Government
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Private
                            </span>
                          )}
                          {isScrapedJob(job) && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {job.source}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleSavedJob(job.id)}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
                aria-label={savedJobs.includes(job.id) ? 'Remove from saved jobs' : 'Save job'}
              >
                {savedJobs.includes(job.id) ? (
                  <BookmarkCheck className="w-5 h-5 text-yellow-500 fill-current" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
            
            <p className="text-lg font-medium text-gray-700 mb-3">{job.company}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location || 'Location not specified'}</span>
                {job.remote && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full ml-2">
                    Remote
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary || 'Salary not specified'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{job.experience || 'Experience not specified'}</span>
              </div>
              {hasApplicationDeadline(job) && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Apply by: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                </div>
              )}
              {hasExamDate(job) && (
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>Exam: {new Date(job.examDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {job.description || (job.requirements && job.requirements[0]) || 'No description available'}
            </p>

            {hasEligibility(job) && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Eligibility:</h4>
                <p className="text-sm text-gray-600">{job.eligibility}</p>
              </div>
            )}

                        <div className="flex items-center gap-3 mt-4">
                          {isScrapedJob(job) && job.url ? (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Apply Now
                              <ExternalLink className="ml-2 w-4 h-4" />
                            </a>
                          ) : (
                            <Link
                              to={`/jobs/${job.id}`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              View Details
                            </Link>
                          )}
                          <button
                            onClick={() => toggleSavedJob(job.id)}
                            className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                              savedJobs.includes(job.id) ? 'text-yellow-500' : ''
                            }`}
                          >
                            {savedJobs.includes(job.id) ? (
                              <>
                                <BookmarkCheck className="w-4 h-4 mr-2" />
                                Saved
                              </>
                            ) : (
                              <>
</div>