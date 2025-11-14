import { NextApiRequest, NextApiResponse } from 'next';

// Simple AI response generator - you can replace this with actual AI service calls
const generateAIResponse = async (message: string, context: any = {}): Promise<string> => {
  // This is a simple mock response generator
  // Replace this with actual AI service integration (OpenAI, Groq, etc.)
  
  const responses = {
    greeting: [
      "Hello! I'm your AI career assistant. How can I help you today?",
      "Hi there! I'm here to help with your career questions. What would you like to know?",
      "Welcome! I'm ready to assist you with job searches, resume tips, and career advice."
    ],
    resume: [
      "Here are some key resume tips:\n\n1. Keep it concise (1-2 pages)\n2. Use action verbs and quantify achievements\n3. Tailor it to each job application\n4. Include relevant keywords from the job description\n5. Proofread carefully for errors",
      "For a strong resume:\n- Start with a compelling summary\n- Highlight your most relevant experience\n- Use bullet points for easy reading\n- Include measurable results when possible\n- Keep formatting clean and professional"
    ],
    interview: [
      "Interview preparation tips:\n\n1. Research the company thoroughly\n2. Practice common interview questions\n3. Prepare specific examples using the STAR method\n4. Dress appropriately for the company culture\n5. Prepare thoughtful questions to ask the interviewer",
      "To ace your interview:\n- Arrive 10-15 minutes early\n- Bring extra copies of your resume\n- Practice your elevator pitch\n- Show enthusiasm for the role\n- Follow up with a thank-you email within 24 hours"
    ],
    jobs: [
      "Here are some effective job search strategies:\n\n1. Use multiple job boards (LinkedIn, Indeed, company websites)\n2. Network with professionals in your field\n3. Optimize your LinkedIn profile\n4. Consider working with recruiters\n5. Apply to jobs that match 70-80% of requirements",
      "For finding the right opportunities:\n- Set up job alerts for relevant positions\n- Attend industry events and meetups\n- Reach out to your professional network\n- Consider remote work options\n- Don't forget about company career pages"
    ],
    salary: [
      "Salary negotiation tips:\n\n1. Research market rates for your role and location\n2. Consider the total compensation package\n3. Wait for the offer before discussing salary\n4. Be prepared to justify your ask with achievements\n5. Practice your negotiation conversation",
      "When discussing compensation:\n- Know your worth based on market research\n- Consider benefits, not just base salary\n- Be professional and confident\n- Have a range in mind, not just one number\n- Be willing to negotiate other aspects if salary is fixed"
    ],
    default: [
      "That's an interesting question! Could you provide more specific details so I can give you better guidance?",
      "I'd be happy to help with that. Can you tell me more about your specific situation or goals?",
      "Great question! To provide the most relevant advice, could you share a bit more context about what you're looking for?"
    ]
  };

  const lowerMessage = message.toLowerCase();
  
  let responseCategory = 'default';
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    responseCategory = 'greeting';
  } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
    responseCategory = 'resume';
  } else if (lowerMessage.includes('interview')) {
    responseCategory = 'interview';
  } else if (lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('work')) {
    responseCategory = 'jobs';
  } else if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('compensation')) {
    responseCategory = 'salary';
  }

  const categoryResponses = responses[responseCategory as keyof typeof responses];
  const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  
  // Add a small delay to simulate processing
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  return randomResponse;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Generate AI response
    const responseContent = await generateAIResponse(message, context);

    return res.status(200).json({
      content: responseContent,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      content: 'Sorry, I encountered an error while processing your request. Please try again.'
    });
  }
}
