/*
  # Community and Interview System

  1. New Tables
    - `posts` - Community posts with content, categories, and engagement
    - `post_likes` - Track user likes on posts
    - `post_comments` - Comments on community posts
    - `interviews` - Real interview scheduling and management
    - `mock_interviews` - AI-powered mock interview sessions
    - `interview_feedback` - Feedback and ratings for interviews
    - `events` - Community events and networking opportunities
    - `event_attendees` - Track event registrations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure users can only modify their own content
*/

-- Posts table for community
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'discussion',
  tags text[] DEFAULT '{}',
  image_url text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post likes
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Post comments
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company text NOT NULL,
  position text NOT NULL,
  interviewer_name text,
  interviewer_role text,
  interview_date date NOT NULL,
  interview_time time NOT NULL,
  duration_minutes integer DEFAULT 60,
  type text NOT NULL CHECK (type IN ('technical', 'hr', 'behavioral', 'final', 'phone-screening')),
  mode text NOT NULL CHECK (mode IN ('video', 'phone', 'in-person')) DEFAULT 'video',
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')) DEFAULT 'scheduled',
  location text,
  meeting_link text,
  notes text,
  preparation_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mock interviews
CREATE TABLE IF NOT EXISTS mock_interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer DEFAULT 30,
  questions_count integer DEFAULT 10,
  status text NOT NULL CHECK (status IN ('not-started', 'in-progress', 'completed')) DEFAULT 'not-started',
  score integer,
  feedback text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Interview feedback
CREATE TABLE IF NOT EXISTS interview_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid REFERENCES interviews(id) ON DELETE CASCADE,
  mock_interview_id uuid REFERENCES mock_interviews(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback_text text,
  strengths text[],
  improvements text[],
  created_at timestamptz DEFAULT now(),
  CHECK ((interview_id IS NOT NULL AND mock_interview_id IS NULL) OR (interview_id IS NULL AND mock_interview_id IS NOT NULL))
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time NOT NULL,
  duration_minutes integer DEFAULT 120,
  location text,
  event_type text NOT NULL CHECK (event_type IN ('virtual', 'in-person', 'hybrid')) DEFAULT 'virtual',
  max_attendees integer,
  current_attendees integer DEFAULT 0,
  organizer text NOT NULL,
  tags text[] DEFAULT '{}',
  image_url text,
  registration_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event attendees
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  registered_at timestamptz DEFAULT now(),
  attendance_status text DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'no-show')),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Users can view all posts" ON posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Post likes policies
CREATE POLICY "Users can view all likes" ON post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can like posts" ON post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Users can view all comments" ON post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON post_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Interviews policies
CREATE POLICY "Users can view own interviews" ON interviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create interviews" ON interviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews" ON interviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interviews" ON interviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Mock interviews policies
CREATE POLICY "Users can view own mock interviews" ON mock_interviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create mock interviews" ON mock_interviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mock interviews" ON mock_interviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Interview feedback policies
CREATE POLICY "Users can view own feedback" ON interview_feedback FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create feedback" ON interview_feedback FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feedback" ON interview_feedback FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Users can view all events" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Event attendees policies
CREATE POLICY "Users can view event attendees" ON event_attendees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can register for events" ON event_attendees FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registration" ON event_attendees FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel own registration" ON event_attendees FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Functions to update counters
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_event_attendees_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events SET current_attendees = current_attendees + 1 WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events SET current_attendees = current_attendees - 1 WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER post_likes_count_trigger
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER post_comments_count_trigger
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

CREATE TRIGGER event_attendees_count_trigger
  AFTER INSERT OR DELETE ON event_attendees
  FOR EACH ROW EXECUTE FUNCTION update_event_attendees_count();

-- Insert sample data
INSERT INTO events (title, description, event_date, event_time, location, event_type, max_attendees, organizer, tags, image_url) VALUES
('Tech Career Fair 2024', 'Connect with top tech companies and explore career opportunities in software development, data science, and AI.', '2024-02-15', '10:00', 'Bangalore International Exhibition Centre', 'in-person', 2000, 'TechCareers India', ARRAY['career-fair', 'tech', 'networking'], 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'),
('Women in Tech Webinar', 'Inspiring stories and career advice from successful women leaders in technology.', '2024-02-10', '19:00', 'Online', 'virtual', 1000, 'WomenTech Network', ARRAY['women-in-tech', 'webinar', 'inspiration'], 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400'),
('Government Jobs Preparation Workshop', 'Expert guidance on UPSC, SSC, and Banking exam preparation strategies.', '2024-02-12', '14:00', 'Delhi & Online', 'hybrid', 500, 'GovJobsPrep', ARRAY['government-jobs', 'exam-prep', 'upsc'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400');