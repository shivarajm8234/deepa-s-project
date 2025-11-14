import * as functions from 'firebase-functions';
import express, { Request, Response } from 'express';
import cors from 'cors';
// Removed axios import as we're not using external API
import * as nodemailer from 'nodemailer';

const app = express();
app.use(cors({ origin: true }));

// Removed Jooble API configuration as we're using Indian job data directly

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'medlinkhealthsite@gmail.com',
    pass: 'ayfh xhim oavq okwu'
  }
});

// New API endpoint for Indian jobs (bypassing cache)
app.get('/getIndianJobs', (req: Request, res: Response) => {
  const { role = 'developer', location = '' } = req.query;
  
  console.log(`Returning Indian jobs for: role=${role}, location=${location || 'India'}`);
  
  // Always return Indian job data for reliable results
  const roleStr = String(role);
  const locationStr = String(location);
    
    // Fallback with Indian job locations and companies
    const fallbackJobs = [
      {
        title: `${roleStr} - Full Stack Developer`,
        company: 'TCS (Tata Consultancy Services)',
        location: locationStr || 'Bangalore, India',
        description: `We are looking for a skilled ${roleStr} to join our dynamic team. Experience with React, Node.js, and modern web technologies required.`,
        url: 'https://www.naukri.com/jobs-in-bangalore',
        date: new Date().toISOString(),
        source: 'Naukri'
      },
      {
        title: `Senior ${roleStr}`,
        company: 'Infosys Technologies',
        location: locationStr || 'Hyderabad, India',
        description: `Join our team as a Senior ${roleStr}. Work on cutting-edge projects with the latest technologies. Hybrid work model available.`,
        url: 'https://www.linkedin.com/jobs/search/?keywords=senior%20developer&location=India',
        date: new Date().toISOString(),
        source: 'LinkedIn'
      },
      {
        title: `${roleStr} - Remote Position`,
        company: 'Wipro Digital',
        location: 'Remote (India)',
        description: `Remote ${roleStr} position available. Work from anywhere in India with flexible hours. Strong problem-solving skills required.`,
        url: 'https://www.indeed.co.in/jobs?q=remote+developer&l=India',
        date: new Date().toISOString(),
        source: 'Indeed India'
      },
      {
        title: `Junior ${roleStr}`,
        company: 'Accenture India',
        location: locationStr || 'Pune, India',
        description: `Entry-level ${roleStr} position perfect for recent graduates. Great learning opportunities and mentorship program.`,
        url: 'https://www.glassdoor.co.in/Jobs/junior-developer-jobs-SRCH_KO0,15_IN115.htm',
        date: new Date().toISOString(),
        source: 'Glassdoor India'
      },
      {
        title: `Lead ${roleStr}`,
        company: 'HCL Technologies',
        location: locationStr || 'Chennai, India',
        description: `Lead ${roleStr} role with team management responsibilities. Experience with agile methodologies and cloud platforms preferred.`,
        url: 'https://www.monster.com/jobs/search/?q=lead-developer&where=India',
        date: new Date().toISOString(),
        source: 'Monster India'
      },
      {
        title: `${roleStr} - Fintech`,
        company: 'Paytm',
        location: locationStr || 'Noida, India',
        description: `Join India's leading fintech company as a ${roleStr}. Work on payment solutions used by millions. Competitive salary and ESOPs.`,
        url: 'https://www.naukri.com/paytm-jobs',
        date: new Date().toISOString(),
        source: 'Naukri'
      },
      {
        title: `${roleStr} - E-commerce`,
        company: 'Flipkart',
        location: locationStr || 'Bangalore, India',
        description: `Be part of India's largest e-commerce platform. ${roleStr} position with opportunities to work on large-scale distributed systems.`,
        url: 'https://www.linkedin.com/company/flipkart/jobs/',
        date: new Date().toISOString(),
        source: 'LinkedIn'
      },
      {
        title: `${roleStr} - Startup`,
        company: 'Zomato',
        location: locationStr || 'Gurgaon, India',
        description: `Join the food-tech revolution! ${roleStr} role at India's leading food delivery platform. Fast-paced startup environment.`,
        url: 'https://www.indeed.co.in/cmp/Zomato/jobs',
        date: new Date().toISOString(),
        source: 'Indeed India'
      }
    ];
    
    return res.status(200).json({
      success: true,
      count: fallbackJobs.length,
      jobs: fallbackJobs,
      fallback: true
    });
});

// Original API endpoint for jobs (for backward compatibility)
app.get('/getJobs', (req: Request, res: Response) => {
  const { role = 'developer', location = '' } = req.query;
  
  console.log(`Returning Indian jobs for: role=${role}, location=${location || 'India'}`);
  
  // Always return Indian job data for reliable results
  const roleStr = String(role);
  const locationStr = String(location);
    
    // Fallback with Indian job locations and companies
    const fallbackJobs = [
      {
        title: `${roleStr} - Full Stack Developer`,
        company: 'TCS (Tata Consultancy Services)',
        location: locationStr || 'Bangalore, India',
        description: `We are looking for a skilled ${roleStr} to join our dynamic team. Experience with React, Node.js, and modern web technologies required.`,
        url: 'https://www.naukri.com/jobs-in-bangalore',
        date: new Date().toISOString(),
        source: 'Naukri'
      },
      {
        title: `Senior ${roleStr}`,
        company: 'Infosys Technologies',
        location: locationStr || 'Hyderabad, India',
        description: `Join our team as a Senior ${roleStr}. Work on cutting-edge projects with the latest technologies. Hybrid work model available.`,
        url: 'https://www.linkedin.com/jobs/search/?keywords=senior%20developer&location=India',
        date: new Date().toISOString(),
        source: 'LinkedIn'
      },
      {
        title: `${roleStr} - Remote Position`,
        company: 'Wipro Digital',
        location: 'Remote (India)',
        description: `Remote ${roleStr} position available. Work from anywhere in India with flexible hours. Strong problem-solving skills required.`,
        url: 'https://www.indeed.co.in/jobs?q=remote+developer&l=India',
        date: new Date().toISOString(),
        source: 'Indeed India'
      },
      {
        title: `Junior ${roleStr}`,
        company: 'Accenture India',
        location: locationStr || 'Pune, India',
        description: `Entry-level ${roleStr} position perfect for recent graduates. Great learning opportunities and mentorship program.`,
        url: 'https://www.glassdoor.co.in/Jobs/junior-developer-jobs-SRCH_KO0,15_IN115.htm',
        date: new Date().toISOString(),
        source: 'Glassdoor India'
      },
      {
        title: `Lead ${roleStr}`,
        company: 'HCL Technologies',
        location: locationStr || 'Chennai, India',
        description: `Lead ${roleStr} role with team management responsibilities. Experience with agile methodologies and cloud platforms preferred.`,
        url: 'https://www.monster.com/jobs/search/?q=lead-developer&where=India',
        date: new Date().toISOString(),
        source: 'Monster India'
      },
      {
        title: `${roleStr} - Fintech`,
        company: 'Paytm',
        location: locationStr || 'Noida, India',
        description: `Join India's leading fintech company as a ${roleStr}. Work on payment solutions used by millions. Competitive salary and ESOPs.`,
        url: 'https://www.naukri.com/paytm-jobs',
        date: new Date().toISOString(),
        source: 'Naukri'
      },
      {
        title: `${roleStr} - E-commerce`,
        company: 'Flipkart',
        location: locationStr || 'Bangalore, India',
        description: `Be part of India's largest e-commerce platform. ${roleStr} position with opportunities to work on large-scale distributed systems.`,
        url: 'https://www.linkedin.com/company/flipkart/jobs/',
        date: new Date().toISOString(),
        source: 'LinkedIn'
      },
      {
        title: `${roleStr} - Startup`,
        company: 'Zomato',
        location: locationStr || 'Gurgaon, India',
        description: `Join the food-tech revolution! ${roleStr} role at India's leading food delivery platform. Fast-paced startup environment.`,
        url: 'https://www.indeed.co.in/cmp/Zomato/jobs',
        date: new Date().toISOString(),
        source: 'Indeed India'
      }
    ];
    
    return res.status(200).json({
      success: true,
      count: fallbackJobs.length,
      jobs: fallbackJobs,
      fallback: true
    });
});

// API endpoint for sending emails
app.post('/sendEmail', async (req: Request, res: Response) => {
  try {
    const { to, from, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, html'
      });
    }

    const mailOptions = {
      from: from || 'medlinkhealthsite@gmail.com',
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Email sending error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: errorMessage
    });
  }
});

// Export the API to Firebase Cloud Functions
export const api = functions.https.onRequest(app);
