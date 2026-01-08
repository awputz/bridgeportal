-- Create calendar_preferences table for user settings
CREATE TABLE public.calendar_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_view TEXT DEFAULT 'week' CHECK (default_view IN ('day', '3day', 'week', 'month', 'agenda')),
  week_starts_on INTEGER DEFAULT 0 CHECK (week_starts_on BETWEEN 0 AND 6),
  time_format TEXT DEFAULT '12h' CHECK (time_format IN ('12h', '24h')),
  working_hours_start TIME DEFAULT '09:00',
  working_hours_end TIME DEFAULT '18:00',
  working_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
  default_event_duration INTEGER DEFAULT 60,
  default_reminder_minutes INTEGER DEFAULT 15,
  show_weekends BOOLEAN DEFAULT true,
  show_declined_events BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.calendar_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only access their own preferences
CREATE POLICY "Users manage own preferences"
  ON public.calendar_preferences
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_calendar_preferences_updated_at
  BEFORE UPDATE ON public.calendar_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();