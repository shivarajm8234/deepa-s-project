-- Drop the table if it exists (this will also drop dependent objects)
DROP TABLE IF EXISTS public.notification_settings CASCADE;

-- Create the notification_settings table
CREATE TABLE public.notification_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  email text,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  in_app_notifications boolean DEFAULT true,
  new_job_alerts boolean DEFAULT true,
  job_match_alerts boolean DEFAULT true,
  application_status_alerts boolean DEFAULT true,
  job_deadline_alerts boolean DEFAULT true,
  salary_alerts boolean DEFAULT false,
  remote_job_alerts boolean DEFAULT true,
  government_job_alerts boolean DEFAULT true,
  interview_reminders boolean DEFAULT true,
  interview_feedback boolean DEFAULT true,
  career_tips boolean DEFAULT true,
  skill_recommendations boolean DEFAULT true,
  industry_news boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT notification_settings_user_id_key UNIQUE (user_id)
);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS notification_settings_user_id_idx ON public.notification_settings (user_id);

-- Enable Row Level Security
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for updated_at
CREATE TRIGGER update_notification_settings_updated_at
BEFORE UPDATE ON public.notification_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create RLS policies
CREATE POLICY "Users can view own settings" 
ON public.notification_settings 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own settings"
ON public.notification_settings 
FOR UPDATE
USING (auth.uid()::text = user_id);

-- Add policy to allow users to insert their own records
CREATE POLICY "Users can insert their own settings"
ON public.notification_settings
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON TABLE public.notification_settings TO authenticated;

-- Add comment for documentation
COMMENT ON TABLE public.notification_settings IS 'Stores user notification preferences and settings';
COMMENT ON COLUMN public.notification_settings.user_id IS 'References auth.users.id (stored as text to match Firebase UIDs)';
COMMENT ON COLUMN public.notification_settings.email IS 'User email address for notifications';

-- This migration is now complete and can be run as a single transaction
