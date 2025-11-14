-- Skip dropping policies/trigger if table doesn't exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notification_settings') THEN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own settings" ON public.notification_settings;
    DROP POLICY IF EXISTS "Users can update own settings" ON public.notification_settings;
    -- Drop the trigger if it exists
    DROP TRIGGER IF EXISTS update_notification_settings_updated_at ON public.notification_settings;
  END IF;
END $$;

-- Create or replace the function if needed
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create notification_settings table if it doesn't exist
create table if not exists public.notification_settings (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  email text,
  email_notifications boolean default true,
  push_notifications boolean default true,
  sms_notifications boolean default false,
  in_app_notifications boolean default true,
  new_job_alerts boolean default true,
  job_match_alerts boolean default true,
  application_status_alerts boolean default true,
  job_deadline_alerts boolean default true,
  salary_alerts boolean default false,
  remote_job_alerts boolean default true,
  government_job_alerts boolean default true,
  interview_reminders boolean default true,
  interview_feedback boolean default true,
  career_tips boolean default true,
  skill_recommendations boolean default true,
  industry_news boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint notification_settings_user_id_key unique (user_id)
);

-- Enable RLS if not already enabled
alter table public.notification_settings enable row level security;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own settings' AND tablename = 'notification_settings') THEN
    create policy "Users can view own settings" 
      on public.notification_settings 
      for select 
      using (auth.uid()::text = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own settings' AND tablename = 'notification_settings') THEN
    create policy "Users can update own settings"
      on public.notification_settings 
      for update
      using (auth.uid()::text = user_id);
  END IF;
END
$$;

-- Function is created above using DO block

-- Create a trigger to automatically update the updated_at column
create trigger update_notification_settings_updated_at
before update on public.notification_settings
for each row
execute function update_updated_at_column();
