export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  rating: number;
  availability: {
    date: string;
    slots: string[];
  }[];
}

export interface Interview {
  id: string;
  userId: string;
  mentorId: string;
  date: string;
  time: string;
  type: 'mock-interview' | 'mentorship';
  status: 'scheduled' | 'completed' | 'cancelled';
}