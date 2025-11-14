-- Drop existing table if it exists
DROP TABLE IF EXISTS public.notification_settings CASCADE;

-- Create the table with text type for user_id
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

-- Enable RLS
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own settings" 
  ON public.notification_settings 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own settings"
  ON public.notification_settings 
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGINaptos move compile --named-addaptos move compile --named-addresses ai_image_generator=0xe242aba5c9c4830193be677bf62342ef57ff6c814940658f05c1c3f31cb5b9a5resses ai_image_generator=0xe242aba5c9c4830193be677bf62342ef57ff6c814940658f05c1c3f31cb5b9a5
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_notification_settings_updated_at
BEFORE UPDATE ON public.notification_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
