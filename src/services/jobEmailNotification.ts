import { sendEmail } from './emailService';
import { supabase } from '../lib/supabase';

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  url: string;
  source: string;
  postedDate?: string;
  jobType?: string;
  remote?: boolean;
  tags: string[];
  type: 'government' | 'non-government';
  experience: string;
  deadline: string;
}

export class JobEmailNotificationService {
  /**
   * Send email notification with scraped jobs to the authenticated user
   */
  async sendJobNotificationToUser(jobs: ScrapedJob[], searchQuery?: string, location?: string): Promise<void> {
    try {
      // Get current authenticated user
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user?.email) {
        console.error('No authenticated user found or user has no email:', error);
        return;
      }

      const userEmail = user.email;
      const userName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';

      if (!jobs || jobs.length === 0) {
        console.log('No jobs to send in notification');
        return;
      }

      // Format the email content
      const subject = `New Job Opportunities Found - ${new Date().toLocaleDateString()}`;
      
      const jobList = jobs.slice(0, 15) // Limit to top 15 jobs
        .map(job => `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
            <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 18px;">${job.title}</h3>
            <p style="margin: 5px 0; font-weight: 600; color: #1f2937;">${job.company}</p>
            <p style="margin: 5px 0; color: #4b5563;">📍 ${job.location}</p>
            ${job.salary ? `<p style="margin: 5px 0; color: #059669; font-weight: 500;">💰 ${job.salary}</p>` : ''}
            ${job.jobType ? `<p style="margin: 5px 0; color: #6366f1;">📋 ${job.jobType}</p>` : ''}
            ${job.experience ? `<p style="margin: 5px 0; color: #7c3aed;">🎯 Experience: ${job.experience}</p>` : ''}
            ${job.deadline ? `<p style="margin: 5px 0; color: #dc2626;">⏰ Deadline: ${job.deadline}</p>` : ''}
            <div style="margin: 10px 0;">
              ${job.tags.slice(0, 5).map(tag => 
                `<span style="display: inline-block; background-color: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 5px;">${tag}</span>`
              ).join('')}
            </div>
            <a href="${job.url}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Apply Now
            </a>
          </div>
        `).join('');

      const searchInfo = searchQuery || location ? 
        `<p style="color: #6b7280; margin-bottom: 20px; font-style: italic;">
          Search criteria: ${searchQuery ? `"${searchQuery}"` : 'All jobs'}${location ? ` in ${location}` : ''}
        </p>` : '';

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 New Job Opportunities</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Fresh opportunities just for you!</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">Hello ${userName},</p>
            <p style="color: #4b5563; margin-bottom: 20px;">We found ${jobs.length} new job opportunities that match your interests. Here are the details:</p>
            
            ${searchInfo}
            
            <div style="margin: 30px 0;">
              ${jobList}
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0;">💡 Quick Tips:</h3>
              <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
                <li>Apply early - many positions are filled quickly</li>
                <li>Customize your resume for each application</li>
                <li>Research the company before applying</li>
                <li>Follow up on your applications</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              This email was sent because you have job alerts enabled. 
              <br>Happy job hunting! 🚀
            </p>
          </div>
        </div>
      `;

      // Send the email
      console.log(`🎯 Sending job notification email to: ${userEmail} (User: ${userName})`);
      const result = await sendEmail(userEmail, subject, html, userName);
      
      if (result.success) {
        console.log(`✅ Job notification email sent successfully to ${userEmail}`);
      } else {
        console.error('❌ Failed to send job notification email:', result.error);
      }
      
    } catch (error) {
      console.error('Error in sendJobNotificationToUser:', error);
    }
  }

  /**
   * Send a quick notification for a single job
   */
  async sendSingleJobNotification(job: ScrapedJob): Promise<void> {
    await this.sendJobNotificationToUser([job]);
  }

  /**
   * Check if user is authenticated and has email
   */
  async canSendNotification(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('🔍 Auth check - User:', user?.email, 'Error:', error);
      return !error && !!user?.email;
    } catch (authError) {
      console.error('❌ Auth check failed:', authError);
      return false;
    }
  }
}

export const jobEmailNotificationService = new JobEmailNotificationService();
