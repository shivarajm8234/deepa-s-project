import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Clock, ExternalLink, Building2, Tag } from 'lucide-react';
import useJobStore from '../stores/jobStore';
import { ScrapedJob } from '../stores/jobStore';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { filteredJobs, scrapedJobs } = useJobStore();
  const [job, setJob] = useState<ScrapedJob | null>(null);

  useEffect(() => {
    // Find the job in both filtered jobs and scraped jobs
    const allJobs = [...filteredJobs, ...scrapedJobs];
    const foundJob = allJobs.find(j => j.id === id) as ScrapedJob;
    setJob(foundJob || null);
  }, [id, filteredJobs, scrapedJobs]);

  if (!job) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Job Details</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Job not found. The job may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Job Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-blue-100">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              {job.company}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            {job.salary && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {job.salary}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Job Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Skills & Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">Job Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Job Type:</span>
                    <span className="font-medium">{job.jobType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{job.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Remote:</span>
                    <span className="font-medium">{job.remote ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium">{job.source}</span>
                  </div>
                  {job.postedDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Posted:</span>
                      <span className="font-medium">
                        {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {job.deadline && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium text-red-600">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Button */}
              <div className="space-y-3">
                {job.url && job.url !== '#' ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply Now
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                ) : (
                  <div className="w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-500 bg-gray-100 text-center">
                    Application link not available
                  </div>
                )}
                
                <div className="text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {job.type === 'government' ? 'Government Job' : 'Private Sector'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;