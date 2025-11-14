// Import commented out as it's not currently used
// import { supabase } from '../lib/supabase';

export interface Interview {
  id: string;
  user_id: string;
  company: string;
  position: string;
  interviewer_name?: string;
  interviewer_role?: string;
  interview_date: string;
  interview_time: string;
  duration_minutes: number;
  type: 'technical' | 'hr' | 'behavioral' | 'final' | 'phone-screening';
  mode: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location?: string;
  meeting_link?: string;
  notes?: string;
  preparation_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MockInterview {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  questions_count: number;
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number;
  feedback?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface InterviewFeedback {
  id: string;
  interview_id?: string;
  mock_interview_id?: string;
  user_id: string;
  rating?: number;
  feedback_text?: string;
  strengths?: string[];
  improvements?: string[];
  created_at: string;
}

export interface MockInterviewTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  questions_count: number;
  rating: number;
  completions: number;
}

class InterviewService {
  // Real Interviews
  async getInterviews(status?: string): Promise<Interview[]> {
    try {
      // Return mock data for now
      const interviews = this.getMockInterviewData();
      if (status) {
        return interviews.filter(interview => interview.status === status);
      }
      return interviews;
    } catch (error) {
      console.error('Error fetching interviews:', error);
      return [];
    }
  }

  async createInterview(interview: Omit<Interview, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Interview> {
    try {
      const newInterview: Interview = {
        ...interview,
        id: `interview-${Date.now()}`,
        user_id: 'current-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'scheduled'
      };
      
      return newInterview;
    } catch (error) {
      console.error('Error creating interview:', error);
      throw error;
    }
  }

  async updateInterview(id: string, updates: Partial<Interview>): Promise<Interview> {
    try {
      const interviews = this.getMockInterviewData();
      const interview = interviews.find(i => i.id === id);
      if (!interview) throw new Error('Interview not found');
      
      return {
        ...interview,
        ...updates,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating interview:', error);
      throw error;
    }
  }

  async deleteInterview(id: string): Promise<void> {
    try {
      console.log('Deleted interview:', id);
    } catch (error) {
      console.error('Error deleting interview:', error);
      throw error;
    }
  }

  // Mock Interviews
  async getMockInterviews(): Promise<MockInterview[]> {
    try {
      return this.getMockMockInterviews();
    } catch (error) {
      console.error('Error getting mock interviews:', error);
      return [];
    }
  }

  async createMockInterview(template: MockInterviewTemplate): Promise<MockInterview> {
    try {
      const mockInterview: MockInterview = {
        id: `mock-${Date.now()}`,
        user_id: 'current-user',
        title: template.title,
        description: template.description,
        category: template.category,
        difficulty: template.difficulty,
        duration_minutes: template.duration_minutes,
        questions_count: template.questions_count,
        status: 'not-started',
        created_at: new Date().toISOString()
      };
      
      return mockInterview;
    } catch (error) {
      console.error('Error creating mock interview:', error);
      throw error;
    }
  }

  async startMockInterview(id: string): Promise<MockInterview> {
    try {
      const mockInterviews = this.getMockMockInterviews();
      const interview = mockInterviews.find(i => i.id === id);
      if (!interview) throw new Error('Mock interview not found');
      
      return {
        ...interview,
        status: 'in-progress',
        started_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error starting mock interview:', error);
      throw error;
    }
  }

  async completeMockInterview(id: string, score: number, feedback: string): Promise<MockInterview> {
    try {
      const mockInterviews = this.getMockMockInterviews();
      const interview = mockInterviews.find(i => i.id === id);
      if (!interview) throw new Error('Mock interview not found');
      
      return {
        ...interview,
        status: 'completed',
        score,
        feedback,
        completed_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error completing mock interview:', error);
      throw error;
    }
  }

  // Interview Feedback
  async createInterviewFeedback(feedback: Omit<InterviewFeedback, 'id' | 'user_id' | 'created_at'>): Promise<InterviewFeedback> {
    try {
      const newFeedback: InterviewFeedback = {
        ...feedback,
        id: `feedback-${Date.now()}`,
        user_id: 'current-user',
        created_at: new Date().toISOString()
      };
      
      return newFeedback;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  }

  async getInterviewFeedback(_interviewId?: string, _mockInterviewId?: string): Promise<InterviewFeedback[]> {
    try {
      return [];
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
  }

  // Mock Interview Templates
  getMockInterviewTemplates(): MockInterviewTemplate[] {
    return [
      {
        id: '1',
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics, ES6 features, and common patterns.',
        category: 'Frontend Development',
        difficulty: 'beginner',
        duration_minutes: 30,
        questions_count: 15,
        rating: 4.5,
        completions: 1250
      },
      {
        id: '2',
        title: 'System Design Interview',
        description: 'Practice designing scalable systems like social media platforms, chat applications.',
        category: 'System Design',
        difficulty: 'advanced',
        duration_minutes: 60,
        questions_count: 8,
        rating: 4.8,
        completions: 890
      },
      {
        id: '3',
        title: 'Data Structures & Algorithms',
        description: 'Solve coding problems involving arrays, trees, graphs, and dynamic programming.',
        category: 'Coding',
        difficulty: 'intermediate',
        duration_minutes: 45,
        questions_count: 12,
        rating: 4.6,
        completions: 2100
      },
      {
        id: '4',
        title: 'Behavioral Interview Practice',
        description: 'Practice common behavioral questions and learn the STAR method.',
        category: 'Behavioral',
        difficulty: 'beginner',
        duration_minutes: 25,
        questions_count: 10,
        rating: 4.3,
        completions: 1680
      },
      {
        id: '5',
        title: 'React.js Deep Dive',
        description: 'Advanced React concepts including hooks, context, performance optimization.',
        category: 'Frontend Development',
        difficulty: 'advanced',
        duration_minutes: 50,
        questions_count: 18,
        rating: 4.7,
        completions: 945
      },
      {
        id: '6',
        title: 'Database Design & SQL',
        description: 'Database normalization, indexing, query optimization, and complex SQL queries.',
        category: 'Backend Development',
        difficulty: 'intermediate',
        duration_minutes: 40,
        questions_count: 14,
        rating: 4.4,
        completions: 1320
      },
      {
        id: '7',
        title: 'Product Management Case Study',
        description: 'Product strategy, user research, feature prioritization, and metrics analysis.',
        category: 'Product Management',
        difficulty: 'intermediate',
        duration_minutes: 45,
        questions_count: 8,
        rating: 4.6,
        completions: 780
      },
      {
        id: '8',
        title: 'Machine Learning Fundamentals',
        description: 'ML algorithms, model evaluation, feature engineering, and practical applications.',
        category: 'Data Science',
        difficulty: 'advanced',
        duration_minutes: 55,
        questions_count: 16,
        rating: 4.5,
        completions: 650
      }
    ];
  }

  // AI Mock Interview Questions Generator
  generateMockInterviewQuestions(category: string, difficulty: string, count: number): string[] {
    const questionBank = {
      'Frontend Development': {
        beginner: [
          'What is the difference between let, const, and var in JavaScript?',
          'Explain the concept of hoisting in JavaScript.',
          'What are the different ways to create objects in JavaScript?',
          'How do you handle events in JavaScript?',
          'What is the difference between == and === in JavaScript?',
          'Explain the box model in CSS.',
          'What are CSS selectors and their types?',
          'How do you make a website responsive?',
          'What is the difference between inline, block, and inline-block elements?',
          'Explain the concept of closures in JavaScript.'
        ],
        intermediate: [
          'Explain the concept of virtual DOM in React.',
          'What are React hooks and why are they useful?',
          'How do you optimize React application performance?',
          'What is the difference between controlled and uncontrolled components?',
          'Explain the concept of state management in React.',
          'What are higher-order components (HOCs)?',
          'How do you handle asynchronous operations in JavaScript?',
          'Explain the concept of promises and async/await.',
          'What is webpack and how does it work?',
          'How do you implement lazy loading in React?'
        ],
        advanced: [
          'Design a scalable frontend architecture for a large application.',
          'How would you implement micro-frontends?',
          'Explain advanced React patterns like render props and compound components.',
          'How do you implement server-side rendering with React?',
          'What are the trade-offs between different state management solutions?',
          'How would you optimize bundle size and loading performance?',
          'Implement a custom React hook for data fetching with caching.',
          'How do you handle complex form validation in React?',
          'Explain the concept of progressive web apps (PWAs).',
          'How would you implement real-time features in a React application?'
        ]
      },
      'System Design': {
        beginner: [
          'Design a simple URL shortener like bit.ly.',
          'How would you design a basic chat application?',
          'Design a simple file storage system.',
          'How would you design a basic social media feed?',
          'Design a simple notification system.',
          'How would you design a basic e-commerce cart?',
          'Design a simple voting system.',
          'How would you design a basic search functionality?',
          'Design a simple user authentication system.',
          'How would you design a basic content management system?'
        ],
        intermediate: [
          'Design a distributed cache system like Redis.',
          'How would you design a scalable messaging system?',
          'Design a content delivery network (CDN).',
          'How would you design a rate limiting system?',
          'Design a distributed file storage system.',
          'How would you design a real-time analytics system?',
          'Design a scalable video streaming platform.',
          'How would you design a distributed search engine?',
          'Design a scalable payment processing system.',
          'How would you design a distributed logging system?'
        ],
        advanced: [
          'Design a global-scale social media platform like Facebook.',
          'How would you design a distributed database system?',
          'Design a real-time collaboration platform like Google Docs.',
          'How would you design a global content delivery system?',
          'Design a distributed consensus system.',
          'How would you design a large-scale recommendation engine?',
          'Design a distributed transaction processing system.',
          'How would you design a global chat application like WhatsApp?',
          'Design a distributed monitoring and alerting system.',
          'How would you design a large-scale data processing pipeline?'
        ]
      },
      'Behavioral': {
        beginner: [
          'Tell me about yourself.',
          'Why do you want to work here?',
          'What are your strengths and weaknesses?',
          'Where do you see yourself in 5 years?',
          'Why are you leaving your current job?',
          'Describe a challenging project you worked on.',
          'How do you handle stress and pressure?',
          'What motivates you?',
          'How do you prioritize your work?',
          'Describe a time when you had to learn something new quickly.'
        ],
        intermediate: [
          'Describe a time when you had to work with a difficult team member.',
          'Tell me about a time when you failed and how you handled it.',
          'Describe a situation where you had to make a difficult decision.',
          'Tell me about a time when you had to persuade someone.',
          'Describe a time when you had to handle multiple priorities.',
          'Tell me about a time when you disagreed with your manager.',
          'Describe a situation where you had to adapt to change.',
          'Tell me about a time when you took initiative.',
          'Describe a time when you had to give constructive feedback.',
          'Tell me about a time when you had to work under tight deadlines.'
        ],
        advanced: [
          'Describe a time when you led a team through a major change.',
          'Tell me about a time when you had to make a decision with incomplete information.',
          'Describe a situation where you had to influence without authority.',
          'Tell me about a time when you had to resolve a conflict between team members.',
          'Describe a time when you had to pivot strategy mid-project.',
          'Tell me about a time when you had to deliver bad news to stakeholders.',
          'Describe a situation where you had to balance competing priorities from different stakeholders.',
          'Tell me about a time when you had to make an unpopular decision.',
          'Describe a time when you had to mentor someone who was struggling.',
          'Tell me about a time when you had to innovate to solve a complex problem.'
        ]
      }
    };

    const questions = questionBank[category as keyof typeof questionBank]?.[difficulty as keyof typeof questionBank['Frontend Development']] || [];
    return questions.slice(0, count);
  }

  // AI Feedback Generator
  generateMockInterviewFeedback(_answers: string[], category: string, difficulty: string): {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  } {
    // Simulate AI analysis
    const score = Math.floor(Math.random() * 30) + 70; // 70-100 range
    
    const strengths = [
      'Clear communication and articulation',
      'Good understanding of fundamental concepts',
      'Structured approach to problem-solving',
      'Relevant examples and experiences shared',
      'Confident delivery and presentation'
    ];

    const improvements = [
      'Could provide more specific technical details',
      'Consider discussing edge cases and error handling',
      'Practice explaining complex concepts more simply',
      'Include more quantifiable results in examples',
      'Work on time management during responses'
    ];

    const feedback = `Overall, you demonstrated a solid understanding of ${category.toLowerCase()} concepts at the ${difficulty} level. Your responses showed good technical knowledge and practical experience. Focus on providing more specific examples and quantifiable results to strengthen your answers.`;

    return {
      score,
      feedback,
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3)
    };
  }

  // Mock data methods for real interviews
  private getMockInterviewData(): Interview[] {
    const now = new Date();
    return [
      {
        id: '1',
        user_id: 'current-user',
        company: 'Tech Mahindra',
        position: 'Senior Developer',
        interviewer_name: 'Rajesh Kumar',
        interviewer_role: 'Technical Lead',
        interview_date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        interview_time: '14:00',
        duration_minutes: 60,
        type: 'technical',
        mode: 'video',
        status: 'scheduled',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        notes: 'Focus on React.js and Node.js experience',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: 'current-user',
        company: 'Infosys',
        position: 'Full Stack Engineer',
        interviewer_name: 'Priya Sharma',
        interviewer_role: 'HR Manager',
        interview_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        interview_time: '11:00',
        duration_minutes: 45,
        type: 'hr',
        mode: 'in-person',
        status: 'scheduled',
        location: 'Infosys Campus, Bangalore',
        notes: 'HR round - discuss career goals and company culture',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private getMockMockInterviews(): MockInterview[] {
    return [
      {
        id: '1',
        user_id: 'current-user',
        title: 'JavaScript Fundamentals',
        description: 'Completed mock interview on JavaScript basics',
        category: 'Frontend Development',
        difficulty: 'beginner',
        duration_minutes: 30,
        questions_count: 15,
        status: 'completed',
        score: 85,
        feedback: 'Good understanding of JavaScript fundamentals. Work on explaining closures more clearly.',
        started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        user_id: 'current-user',
        title: 'System Design Interview',
        description: 'Practice session for system design concepts',
        category: 'System Design',
        difficulty: 'advanced',
        duration_minutes: 60,
        questions_count: 8,
        status: 'in-progress',
        started_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ];
  }
}

export const interviewService = new InterviewService();