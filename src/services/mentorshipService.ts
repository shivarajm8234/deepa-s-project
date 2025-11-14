import { supabase } from '../lib/supabase';

export interface Mentor {
  id: string;
  user_id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  experience_years: number;
  rating: number;
  total_sessions: number;
  hourly_rate?: number;
  bio: string;
  availability: {
    day: string;
    slots: string[];
  }[];
  image_url?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MentorshipSession {
  id: string;
  mentor_id: string;
  mentee_id: string;
  title: string;
  description: string;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  meeting_link?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  mentor?: Mentor;
}

class MentorshipService {
  async getMentors(expertise?: string, limit = 20): Promise<Mentor[]> {
    try {
      // Return mock mentors for now
      return this.getMockMentors(expertise);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      return this.getMockMentors(expertise);
    }
  }

  async getMentorById(id: string): Promise<Mentor | null> {
    try {
      const mentors = this.getMockMentors();
      return mentors.find(mentor => mentor.id === id) || null;
    } catch (error) {
      console.error('Error fetching mentor:', error);
      return null;
    }
  }

  async bookMentorshipSession(session: Omit<MentorshipSession, 'id' | 'mentee_id' | 'created_at' | 'updated_at'>): Promise<MentorshipSession> {
    try {
      const newSession: MentorshipSession = {
        ...session,
        id: `session-${Date.now()}`,
        mentee_id: 'current-user',
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return newSession;
    } catch (error) {
      console.error('Error booking session:', error);
      throw error;
    }
  }

  async getMentorshipSessions(): Promise<MentorshipSession[]> {
    try {
      return this.getMockSessions();
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return this.getMockSessions();
    }
  }

  async cancelMentorshipSession(sessionId: string): Promise<void> {
    try {
      console.log('Cancelled session:', sessionId);
    } catch (error) {
      console.error('Error cancelling session:', error);
      throw error;
    }
  }

  async rateMentor(sessionId: string, rating: number, feedback: string): Promise<void> {
    try {
      console.log('Rated mentor:', { sessionId, rating, feedback });
    } catch (error) {
      console.error('Error rating mentor:', error);
      throw error;
    }
  }

  private getMockMentors(expertise?: string): Mentor[] {
    const mockMentors: Mentor[] = [
      {
        id: '1',
        user_id: 'mentor1',
        name: 'Priya Sharma',
        title: 'Senior Software Engineer',
        company: 'Google India',
        expertise: ['Frontend Development', 'React.js', 'JavaScript', 'Career Guidance'],
        experience_years: 8,
        rating: 4.9,
        total_sessions: 156,
        hourly_rate: 2500,
        bio: 'Experienced frontend developer with 8+ years at top tech companies. Passionate about mentoring and helping developers grow their careers.',
        availability: [
          { day: 'Monday', slots: ['18:00', '19:00', '20:00'] },
          { day: 'Wednesday', slots: ['18:00', '19:00'] },
          { day: 'Saturday', slots: ['10:00', '11:00', '14:00', '15:00'] }
        ],
        image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
        linkedin_url: 'https://linkedin.com/in/priyasharma',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: 'mentor2',
        name: 'Rahul Kumar',
        title: 'Principal Data Scientist',
        company: 'Microsoft India',
        expertise: ['Data Science', 'Machine Learning', 'Python', 'AI'],
        experience_years: 10,
        rating: 4.8,
        total_sessions: 203,
        hourly_rate: 3000,
        bio: 'Data science leader with extensive experience in ML and AI. Helped 200+ professionals transition into data science careers.',
        availability: [
          { day: 'Tuesday', slots: ['19:00', '20:00'] },
          { day: 'Thursday', slots: ['18:00', '19:00', '20:00'] },
          { day: 'Sunday', slots: ['10:00', '11:00', '16:00'] }
        ],
        image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        linkedin_url: 'https://linkedin.com/in/rahulkumar',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        user_id: 'mentor3',
        name: 'Anita Patel',
        title: 'Product Manager',
        company: 'Amazon India',
        expertise: ['Product Management', 'Strategy', 'Leadership', 'Career Transition'],
        experience_years: 7,
        rating: 4.7,
        total_sessions: 89,
        hourly_rate: 2800,
        bio: 'Product management expert who transitioned from engineering. Specializes in helping technical professionals move into product roles.',
        availability: [
          { day: 'Monday', slots: ['20:00', '21:00'] },
          { day: 'Friday', slots: ['18:00', '19:00'] },
          { day: 'Saturday', slots: ['16:00', '17:00'] }
        ],
        image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        linkedin_url: 'https://linkedin.com/in/anitapatel',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        user_id: 'mentor4',
        name: 'Vikram Singh',
        title: 'Engineering Manager',
        company: 'Flipkart',
        expertise: ['Engineering Management', 'System Design', 'Team Leadership', 'Startup Experience'],
        experience_years: 12,
        rating: 4.9,
        total_sessions: 134,
        hourly_rate: 3500,
        bio: 'Engineering leader with startup and big tech experience. Passionate about building high-performing teams and scaling engineering organizations.',
        availability: [
          { day: 'Wednesday', slots: ['20:00', '21:00'] },
          { day: 'Saturday', slots: ['09:00', '10:00', '11:00'] },
          { day: 'Sunday', slots: ['14:00', '15:00'] }
        ],
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        linkedin_url: 'https://linkedin.com/in/vikramsingh',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        user_id: 'mentor5',
        name: 'Sneha Reddy',
        title: 'UX Design Lead',
        company: 'Zomato',
        expertise: ['UX Design', 'UI Design', 'Design Thinking', 'User Research'],
        experience_years: 6,
        rating: 4.8,
        total_sessions: 67,
        hourly_rate: 2200,
        bio: 'Design leader passionate about creating user-centered experiences. Helps designers and non-designers understand the power of good design.',
        availability: [
          { day: 'Tuesday', slots: ['18:00', '19:00'] },
          { day: 'Thursday', slots: ['20:00', '21:00'] },
          { day: 'Sunday', slots: ['11:00', '12:00', '17:00'] }
        ],
        image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
        linkedin_url: 'https://linkedin.com/in/snehareddy',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    if (expertise) {
      return mockMentors.filter(mentor => 
        mentor.expertise.some(exp => 
          exp.toLowerCase().includes(expertise.toLowerCase())
        )
      );
    }

    return mockMentors;
  }

  private getMockSessions(): MentorshipSession[] {
    return [
      {
        id: '1',
        mentor_id: '1',
        mentee_id: 'current-user',
        title: 'React.js Career Guidance',
        description: 'Discussion about React.js career path and skill development',
        session_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        session_time: '18:00',
        duration_minutes: 60,
        status: 'scheduled',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        mentor_id: '2',
        mentee_id: 'current-user',
        title: 'Data Science Career Transition',
        description: 'Completed session about transitioning to data science',
        session_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        session_time: '19:00',
        duration_minutes: 60,
        status: 'completed',
        notes: 'Discussed learning path for data science transition',
        feedback: 'Very helpful session with actionable advice',
        rating: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}

export const mentorshipService = new MentorshipService();