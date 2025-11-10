const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");
const nodemailer = require("nodemailer");
const functions = require("firebase-functions");

setGlobalOptions({ maxInstances: 10 });

// Email transporter configuration using Firebase Config
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().gmail?.user || 'medlinkhealthsite@gmail.com',
    pass: functions.config().gmail?.pass || 'ayfh xhim oavq okwu'
  }
});

// Jobs API endpoint
exports.getJobs = onRequest({
  cors: true
}, async (req, res) => {
  try {
    const { role = 'developer', location = '', page = 1, limit = 20 } = req.query;
    
    const JOOBLE_KEY = functions.config().jooble?.key || '5f032677-ea3c-452d-b003-c20c2ed65dee';
    const JOOBLE_URL = 'https://jooble.org/api/' + JOOBLE_KEY;
    
    const response = await axios.post(JOOBLE_URL, {
      keywords: role,
      location: location,
      page: Number(page) || 1,
    });

    const jobs = response.data.jobs || [];
    
    // Transform jobs to match expected format
    const transformedJobs = jobs.map(job => ({
      id: job.id || Math.random().toString(36).substr(2, 9),
      title: job.title || 'No Title',
      company: job.company || 'Unknown Company',
      location: job.location || location || 'Remote',
      salary: job.salary || '',
      jobType: job.type || 'Full-time',
      experience: job.experience || '',
      deadline: job.updated || '',
      tags: job.snippet ? [job.snippet.substring(0, 50)] : ['Job'],
      url: job.link || '#',
      description: job.snippet || 'No description available'
    }));

    logger.info(`Jobs API called: ${transformedJobs.length} jobs found for role: ${role}, location: ${location}`);
    
    res.json({
      success: true,
      jobs: transformedJobs,
      total: transformedJobs.length
    });
  } catch (error) {
    logger.error('Jobs API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
});

// Email sending endpoint
exports.sendEmail = onRequest({
  cors: true
}, async (req, res) => {
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
    
    logger.info(`Email sent successfully to ${to}`);
    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    logger.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

