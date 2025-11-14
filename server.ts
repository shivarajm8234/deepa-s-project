import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { handler as scrapeJobsHandler } from './pages/api/scrape-jobs';
import { handler as jobsHandler } from './pages/api/jobs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createServer() {
  const app = express();
  
  // Enable CORS for all routes
  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  }));
  
  // Parse JSON bodies
  app.use(express.json());
  
  // Create Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'medlinkhealthsite@gmail.com',
      pass: 'ayfh xhim oavq okwu' // App Password
    }
  });

  // Verify connection configuration
  transporter.verify((error) => {
    if (error) {
      console.error('Error verifying email transport:', error);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });

  // API routes
  app.get('/api/scrape-jobs', async (req, res) => {
    const { method, url, headers } = req;
    const request = new IncomingMessage(req.socket);
    request.method = method;
    request.url = url;
    request.headers = headers;
    
    const response = new ServerResponse(req);
    
    response.end = function(chunk?: any, encoding?: any, cb?: any) {
      if (chunk) res.write(chunk, encoding);
      res.end(cb);
      return response;
    };
    
    await scrapeJobsHandler(request, response);
  });

  app.get('/api/jobs', async (req, res) => {
    const { method, url, headers } = req;
    const request = new IncomingMessage(req.socket);
    request.method = method;
    request.url = url;
    request.headers = headers;
    
    const response = new ServerResponse(req);
    
    response.end = function(chunk?: any, encoding?: any, cb?: any) {
      if (chunk) res.write(chunk, encoding);
      res.end(cb);
      return response;
    };
    
    await jobsHandler(request, response);
  });
  
  // Email sending endpoint
  app.post('/api/send-email', async (req, res) => {
    console.log('Received email request:', req.body);
    
    try {
      const { to, subject, html, from } = req.body;
      
      if (!to || !subject || !html) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: to, subject, or html'
        });
      }

      const mailOptions = {
        from: from || 'MedLink Health <medlinkhealthsite@gmail.com>',
        to,
        subject,
        html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      
      res.json({ 
        success: true, 
        message: 'Email sent successfully',
        messageId: info.messageId 
      });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // In development, use Vite's middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files
    app.use(express.static(join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  return new Promise(resolve => {
    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

createServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
