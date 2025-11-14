import { useState, useCallback } from 'react';
import { firebaseConfig } from '../config/firebase';
import useAuthStore from '../stores/authStore';

export interface JobListing {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  url: string;
  postedDate?: string;
  source: string;
}

interface SearchParams {
  role?: string;
  country?: string;
}

export const useJobListings = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchJobs = async (params: { role?: string; country?: string } = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const { role = '', country = '' } = params;
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const isDev = window.location.hostname === 'localhost';
      const apiUrl = isDev 
        ? `/api/getJobs?role=${encodeURIComponent(role)}&location=${encodeURIComponent(country)}&_t=${timestamp}`
        : `https://us-central1-jobai-33c94.cloudfunctions.net/api/getIndianJobs?role=${encodeURIComponent(role)}&location=${encodeURIComponent(country)}&_t=${timestamp}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fresh job data received:', data);
      
      if (data.success && Array.isArray(data.jobs)) {
        console.log('Setting jobs with URLs:', data.jobs.map((j: any) => ({ title: j.title, url: j.url })));
        setJobs(data.jobs);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
      
      const jobs = data.jobs || [];
      
      // Send email notification if jobs were found
      if (jobs.length > 0) {
        console.log(`🔍 Found ${jobs.length} jobs, sending email notification...`);
        try {
          // Get the logged-in user's email
          const userEmail = user?.email;
          
          console.log('🔍 Debug - Current user:', user);
          console.log('🔍 Debug - User email:', userEmail);
          
          if (!userEmail) {
            console.log('ℹ️ No authenticated user found, skipping email notification');
            return;
          }
          
          console.log(`📧 Sending email to authenticated user: ${userEmail}`);
          
          // Format jobs for email
          const jobList = jobs.slice(0, 15).map((job: JobListing) => `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
              <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 18px;">${job.title}</h3>
              <p style="margin: 5px 0; font-weight: 600; color: #1f2937;">${job.company}</p>
              <p style="margin: 5px 0; color: #4b5563;">📍 ${job.location}</p>
              ${job.salary ? `<p style="margin: 5px 0; color: #059669; font-weight: 500;">💰 ${job.salary}</p>` : ''}
              <a href="${job.url}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Apply Now
              </a>
            </div>
          `).join('');

          const subject = `New Job Opportunities Found - ${new Date().toLocaleDateString()}`;
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎯 New Job Opportunities</h1>
                <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Fresh opportunities just for you!</p>
              </div>
              
              <div style="padding: 30px;">
                <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">Hello,</p>
                <p style="color: #4b5563; margin-bottom: 20px;">We found ${jobs.length} new job opportunities for "${role || 'developer'}" ${country ? `in ${country}` : ''}. Here are the details:</p>
                
                <div style="margin: 30px 0;">
                  ${jobList}
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                  This email was sent because you searched for jobs. 
                  <br>Happy job hunting! 🚀
                </p>
              </div>
            </div>
          `;

          // Send email using Firebase Functions
          const response = await fetch(firebaseConfig.current.emailApi, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: userEmail,
              from: 'MedLink Health <medlinkhealthsite@gmail.com>',
              subject: `[MedLink] ${subject}`,
              html: html
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Email sent successfully to ${userEmail}:`, result.messageId);
          } else {
            console.error('❌ Failed to send email:', await response.text());
          }
        } catch (emailError) {
          console.error('❌ Failed to send email notification:', emailError);
        }
      } else {
        console.log('ℹ️ No jobs found, skipping email notification');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { jobs, loading, error, fetchJobs };
};
