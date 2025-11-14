import { firebaseConfig } from '../config/firebase';

// Email configuration using centralized config

interface EmailResponse {
  success: boolean;
  error?: Error;
  message?: string;
}

/**
 * Sends an email using the server API
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  toName?: string
): Promise<EmailResponse> => {
  try {
    const emailData = {
      to: toName ? `"${toName}" <${to}>` : to,
      from: 'MedLink Health <medlinkhealthsite@gmail.com>',
      subject: `[MedLink] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">MedLink Health</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
            ${html}
          </div>
          <p style="color: #6b7280; font-size: 0.875rem; margin-top: 20px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    console.log('Sending email with data:', JSON.stringify(emailData, null, 2));

    const response = await fetch(firebaseConfig.current.emailApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
      credentials: 'include',
    });

    let responseData;
    const contentType = response.headers.get('content-type');
    
    try {
      responseData = contentType?.includes('application/json') 
        ? await response.json() 
        : await response.text();
    } catch (e) {
      console.error('Error parsing response:', e);
      responseData = { message: 'Failed to parse server response' };
    }

    if (!response.ok) {
      const errorMessage = typeof responseData === 'object' 
        ? responseData.message || 'Failed to send email'
        : String(responseData || 'Failed to send email');
      
      console.error('Email sending failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      
      throw new Error(errorMessage);
    }

    console.log('Email sent successfully:', responseData);
    return { 
      success: true,
      message: responseData.message || 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error in sendEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
      message: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};
