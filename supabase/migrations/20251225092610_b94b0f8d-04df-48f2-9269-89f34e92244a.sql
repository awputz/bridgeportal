-- Create calendar_events table for company-wide events
CREATE TABLE public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  all_day boolean DEFAULT false,
  event_type text DEFAULT 'company',
  location text,
  created_by uuid,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_google_tokens table for storing Google OAuth tokens
CREATE TABLE public.user_google_tokens (
  user_id uuid PRIMARY KEY,
  access_token text,
  refresh_token text,
  token_expiry timestamptz,
  calendar_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Admin/agents can manage calendar events
CREATE POLICY "Admins can manage calendar events"
ON public.calendar_events
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- Anyone authenticated can view active events
CREATE POLICY "Authenticated users can view active events"
ON public.calendar_events
FOR SELECT
USING (is_active = true);

-- Enable RLS on user_google_tokens
ALTER TABLE public.user_google_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own tokens
CREATE POLICY "Users can manage their own tokens"
ON public.user_google_tokens
FOR ALL
USING (auth.uid() = user_id);

-- Create updated_at trigger for calendar_events
CREATE TRIGGER update_calendar_events_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for user_google_tokens
CREATE TRIGGER update_user_google_tokens_updated_at
BEFORE UPDATE ON public.user_google_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster event queries
CREATE INDEX idx_calendar_events_start_time ON public.calendar_events(start_time);
CREATE INDEX idx_calendar_events_event_type ON public.calendar_events(event_type);