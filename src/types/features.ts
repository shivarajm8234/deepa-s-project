export interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: number; // 1-5
  targetLevel: number;  // 1-5
  importance: 'low' | 'medium' | 'high';
}

export interface CareerPathway {
  id: string;
  title: string;
  description: string;
  steps: PathwayStep[];
  estimatedDuration: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  skillsRequired: string[];
}

export interface PathwayStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  resources: {
    title: string;
    url: string;
    type: 'course' | 'article' | 'video' | 'book';
  }[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  skills: string[];
  achievements?: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  startDate: string;
  endDate?: string;
  isFeatured: boolean;
}
