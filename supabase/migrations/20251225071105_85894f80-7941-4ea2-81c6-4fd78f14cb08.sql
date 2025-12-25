-- Create agent_notes table for Sticky Notes feature
CREATE TABLE public.agent_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT 'yellow',
  is_pinned BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_notes ENABLE ROW LEVEL SECURITY;

-- RLS policy: agents can only manage their own notes
CREATE POLICY "Agents can manage their own notes"
ON public.agent_notes
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_agent_notes_updated_at
BEFORE UPDATE ON public.agent_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();