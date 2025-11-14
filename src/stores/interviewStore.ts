import { create } from 'zustand';
import { Interview, Mentor } from '../types/interview';

interface InterviewState {
  interviews: Interview[];
  mentors: Mentor[];
  scheduleInterview: (interview: Omit<Interview, 'id'>) => void;
  cancelInterview: (id: string) => void;
}

const MOCK_MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    company: 'Google',
    expertise: ['Frontend', 'React', 'System Design'],
    rating: 4.8,
    availability: [
      {
        date: '2024-04-01',
        slots: ['10:00', '14:00', '16:00'],
      },
      {
        date: '2024-04-02',
        slots: ['11:00', '15:00'],
      },
    ],
  },
  // Add more mock mentors...
];

const useInterviewStore = create<InterviewState>((set) => ({
  interviews: [],
  mentors: MOCK_MENTORS,
  scheduleInterview: (interview) =>
    set((state) => ({
      interviews: [
        ...state.interviews,
        { ...interview, id: Math.random().toString() },
      ],
    })),
  cancelInterview: (id) =>
    set((state) => ({
      interviews: state.interviews.map((interview) =>
        interview.id === id
          ? { ...interview, status: 'cancelled' }
          : interview
      ),
    })),
}));

export default useInterviewStore;