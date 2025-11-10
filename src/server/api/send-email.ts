import type { ViteDevServer } from 'vite';
import nodemailer from 'nodemailer';

export function configureEmailApi(server: ViteDevServer) {
  // Create a Nodemailer transporter using Gmail
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

  // Handle POST /api/send-email
  server.middlewares.use('/api/send-email', async (req, res) => {
    // Only handle POST requests
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end('Method Not Allowed');
      return;
    }

    try {
      // Read and parse the request body
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString());

      // Validate required fields
      if (!body.to || !body.subject || !body.html) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
        return;
      }

      // Send the email
      const info = await transporter.sendMail({
        from: body.from || 'MedLink Health <medlinkhealthsite@gmail.com>',
        to: body.to,
        subject: body.subject,
        html: body.html,
      });

      console.log('Email sent:', info.messageId);
      
      res.statusCode = 200;
      res.end(JSON.stringify({ 
        success: true, 
        messageId: info.messageId 
      }));
    } catch (error) {
      console.error('Error sending email:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({ 
        success: false, 
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  });
}
