export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'evaluation' | 'error';
  metadata?: {
    suggestions?: string[];
    evaluation?: {
      score: number;
      feedback: string;
    };
    interviewQuestion?: boolean;
    difficulty?: string;
    jobType?: string;
  };
}

export interface MockInterviewSession {
  id: string;
  title: string;
  questions: string[];
  currentQuestionIndex: number;
  userAnswers: Record<number, string>;
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'cancelled';
  evaluation?: {
    overallScore: number;
    feedback: string;
    questionEvaluations: Array<{
      questionIndex: number;
      score: number;
      feedback: string;
    }>;
  };
}

export interface ChatContext {
  type: 'mock_interview' | 'general' | 'career_advice';
  confidence: number;
  entities: Record<string, any>;
}
