-- Create calendar_templates table for reusable event templates
CREATE TABLE public.calendar_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL DEFAULT '{}',
  is_shared BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.calendar_templates ENABLE ROW LEVEL SECURITY;

-- Users can manage their own templates or view shared templates
CREATE POLICY "Users can view own or shared templates" 
  ON public.calendar_templates FOR SELECT 
  USING (auth.uid() = user_id OR is_shared = true);

CREATE POLICY "Users can create own templates" 
  ON public.calendar_templates FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" 
  ON public.calendar_templates FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" 
  ON public.calendar_templates FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_calendar_templates_updated_at
  BEFORE UPDATE ON public.calendar_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create calendar_event_links table for CRM integration
CREATE TABLE public.calendar_event_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(google_event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.calendar_event_links ENABLE ROW LEVEL SECURITY;

-- Users manage their own links
CREATE POLICY "Users can view own event links" 
  ON public.calendar_event_links FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own event links" 
  ON public.calendar_event_links FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own event links" 
  ON public.calendar_event_links FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own event links" 
  ON public.calendar_event_links FOR DELETE 
  USING (auth.uid() = user_id);

-- Indexes for efficient lookups
CREATE INDEX idx_calendar_event_links_deal ON public.calendar_event_links(deal_id);
CREATE INDEX idx_calendar_event_links_contact ON public.calendar_event_links(contact_id);
CREATE INDEX idx_calendar_event_links_google ON public.calendar_event_links(google_event_id);
CREATE INDEX idx_calendar_templates_user ON public.calendar_templates(user_id);

-- Insert pre-built shared templates
INSERT INTO public.calendar_templates (user_id, name, description, template_data, is_shared) VALUES
(NULL, 'Property Showing', 'Standard property showing with client', '{"title_pattern": "Showing: {property}", "duration": 60, "color": "#039be5", "event_type": "showing"}', true),
(NULL, 'Client Meeting', 'In-person or virtual client meeting', '{"title_pattern": "Meeting with {client}", "duration": 30, "color": "#7986cb", "event_type": "meeting"}', true),
(NULL, 'Team Standup', 'Daily team sync meeting', '{"title_pattern": "Team Standup", "duration": 15, "color": "#33b679", "event_type": "meeting"}', true),
(NULL, 'Focus Time', 'Block time for focused work', '{"title_pattern": "Focus Time 🎯", "duration": 120, "color": "#8e24aa", "event_type": "focus_time"}', true),
(NULL, 'Follow-up Call', 'Quick follow-up call with client', '{"title_pattern": "Follow-up: {client}", "duration": 15, "color": "#f6bf26", "event_type": "call"}', true);