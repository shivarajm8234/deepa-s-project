import React, { useState } from 'react';
import { jobScrapingService } from '../services/jobScrapingService';
import { jobEmailNotificationService } from '../services/jobEmailNotification';
import { useAuth } from '../contexts/AuthContext';

const JobEmailTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('software engineer');
  const [location, setLocation] = useState('Remote');
  const { user } = useAuth();

  const handleScrapeAndEmail = async () => {
    if (!user?.email) {
      setMessage('Please log in to receive email notifications');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Scrape jobs with email notification enabled
      const response = await jobScrapingService.scrapeJobs(query, location, true);
      
      if (response.jobs && response.jobs.length > 0) {
        setMessage(`✅ Found ${response.jobs.length} jobs and sent email notification to ${user.email}`);
      } else {
        setMessage('No jobs found for the given criteria');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Failed to scrape jobs or send email');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!user?.email) {
      setMessage('Please log in to test email notifications');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Create sample job data for testing
      const sampleJobs = [
        {
          id: 'test-1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'Remote',
          salary: '$120,000 - $150,000',
          description: 'Join our team as a Senior Software Engineer...',
          url: 'https://example.com/job/1',
          source: 'test',
          jobType: 'Full-time',
          remote: true,
          tags: ['React', 'TypeScript', 'Node.js'],
          type: 'non-government' as const,
          experience: '5+ years',
          deadline: '2024-01-15'
        },
        {
          id: 'test-2',
          title: 'Frontend Developer',
          company: 'StartupXYZ',
          location: 'San Francisco, CA',
          salary: '$90,000 - $120,000',
          description: 'We are looking for a talented Frontend Developer...',
          url: 'https://example.com/job/2',
          source: 'test',
          jobType: 'Full-time',
          remote: false,
          tags: ['Vue.js', 'CSS', 'JavaScript'],
          type: 'non-government' as const,
          experience: '3+ years',
          deadline: '2024-01-20'
        }
      ];

      await jobEmailNotificationService.sendJobNotificationToUser(sampleJobs, 'Test Jobs', 'Various');
      setMessage(`✅ Test email sent successfully to ${user.email}`);
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Job Email Notification Test</h2>
      
      {user?.email ? (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-700">
            ✅ Logged in as: <strong>{user.email}</strong>
          </p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">❌ Please log in to test email notifications</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Search Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., software engineer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Remote"
          />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <button
          onClick={handleScrapeAndEmail}
          disabled={loading || !user?.email}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Scrape Jobs & Send Email'}
        </button>

        <button
          onClick={handleTestEmail}
          disabled={loading || !user?.email}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending...' : 'Send Test Email (Sample Jobs)'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('✅') 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : message.includes('❌')
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-blue-50 border border-blue-200 text-blue-700'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• When you scrape jobs, an email is automatically sent to your logged-in email</li>
          <li>• The email contains formatted job listings with apply links</li>
          <li>• You can test with sample data using the "Send Test Email" button</li>
          <li>• Make sure you're logged in with Google Authentication</li>
        </ul>
      </div>
    </div>
  );
};

export default JobEmailTest;
