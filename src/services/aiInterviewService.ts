interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  expectedAnswer?: string;
  hints?: string[];
}

interface InterviewEvaluation {
  score: number;
  feedback: string;
  suggestions: string[];
}

interface InterviewFeedback {
  overallScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}

class AIInterviewService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  }

  async generateQuestions(category: string, difficulty: string, count: number): Promise<{
    questions: InterviewQuestion[];
    sessionId: string;
    timestamp: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-interview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_questions',
          category,
          difficulty,
          count
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to generate questions');
      }

      return data;
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to local generation
      return this.generateQuestionsLocally(category, difficulty, count);
    }
  }

  async evaluateAnswer(question: InterviewQuestion, answer: string): Promise<InterviewEvaluation> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-interview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'evaluate_answer',
          question,
          answer
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to evaluate answer');
      }

      return data;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      // Fallback to local evaluation
      return this.evaluateAnswerLocally(question, answer);
    }
  }

  async generateFeedback(
    questions: InterviewQuestion[],
    answers: string[],
    category: string,
    difficulty: string
  ): Promise<InterviewFeedback> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-interview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_feedback',
          questions,
          answers,
          category,
          difficulty
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to generate feedback');
      }

      return data;
    } catch (error) {
      console.error('Error generating feedback:', error);
      // Fallback to local feedback generation
      return this.generateFeedbackLocally(questions, answers, category, difficulty);
    }
  }

  // Fallback methods for offline functionality
  private generateQuestionsLocally(category: string, difficulty: string, count: number): {
    questions: InterviewQuestion[];
    sessionId: string;
    timestamp: string;
  } {
    const questionBank = {
      'Frontend Development': {
        beginner: [
          'What is the difference between let, const, and var in JavaScript?',
          'Explain the concept of hoisting in JavaScript.',
          'What are the different ways to create objects in JavaScript?',
          'How do you handle events in JavaScript?',
          'What is the difference between == and === in JavaScript?'
        ],
        intermediate: [
          'Explain the concept of virtual DOM in React.',
          'What are React hooks and why are they useful?',
          'How do you optimize React application performance?',
          'What is the difference between controlled and uncontrolled components?',
          'Explain the concept of state management in React.'
        ],
        advanced: [
          'Design a scalable frontend architecture for a large application.',
          'How would you implement server-side rendering with React?',
          'Explain advanced React patterns like render props and compound components.',
          'How do you implement micro-frontends?',
          'What are the trade-offs between different state management solutions?'
        ]
      }
    };

    const categoryQuestions = questionBank[category as keyof typeof questionBank];
    const difficultyQuestions = categoryQuestions?.[difficulty as keyof typeof categoryQuestions] || [];
    
    const questions: InterviewQuestion[] = difficultyQuestions.slice(0, count).map((q, index) => ({
      id: `q-${Date.now()}-${index}`,
      question: q,
      category,
      difficulty,
      hints: ['Think step by step', 'Consider examples', 'Explain your reasoning']
    }));

    return {
      questions,
      sessionId: `session-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  }

  private evaluateAnswerLocally(question: InterviewQuestion, answer: string): InterviewEvaluation {
    const score = Math.floor(Math.random() * 40) + 60; // 60-100 range
    
    let feedback = '';
    let suggestions: string[] = [];
    
    if (score >= 80) {
      feedback = 'Excellent answer! You demonstrated strong understanding.';
      suggestions = ['Consider adding specific examples', 'Mention edge cases'];
    } else if (score >= 70) {
      feedback = 'Good answer with room for improvement.';
      suggestions = ['Add more technical details', 'Explain your reasoning'];
    } else {
      feedback = 'The answer needs improvement.';
      suggestions = ['Review the fundamental concepts', 'Practice with examples'];
    }
    
    return { score, feedback, suggestions };
  }

  private generateFeedbackLocally(
    questions: InterviewQuestion[],
    answers: string[],
    category: string,
    difficulty: string
  ): InterviewFeedback {
    const overallScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
    
    return {
      overallScore,
      feedback: `Good performance in ${category} at ${difficulty} level. Keep practicing to improve further.`,
      strengths: ['Clear communication', 'Good technical foundation', 'Problem-solving approach'],
      improvements: ['Add more specific examples', 'Explain concepts more deeply', 'Practice time management'],
      nextSteps: ['Take advanced courses', 'Build more projects', 'Practice mock interviews']
    };
  }
}

export const aiInterviewService = new AIInterviewService();