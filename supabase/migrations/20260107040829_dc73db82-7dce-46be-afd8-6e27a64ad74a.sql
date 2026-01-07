-- Create deal_matches table for AI-generated matches
CREATE TABLE public.deal_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  match_score integer NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons text[] DEFAULT '{}',
  ai_summary text,
  is_dismissed boolean DEFAULT false,
  is_contacted boolean DEFAULT false,
  contacted_at timestamptz,
  contacted_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(deal_id, contact_id)
);

-- Enable RLS
ALTER TABLE public.deal_matches ENABLE ROW LEVEL SECURITY;

-- Agents can view matches for deals in the deal room
CREATE POLICY "Agents can view deal matches" ON public.deal_matches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'agent')
    )
  );

-- Agents can insert matches (via edge function with service role, but also allow direct)
CREATE POLICY "Agents can insert deal matches" ON public.deal_matches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'agent')
    )
  );

-- Agents can update matches (dismiss, mark contacted)
CREATE POLICY "Agents can update deal matches" ON public.deal_matches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'agent')
    )
  );

-- Agents can delete matches
CREATE POLICY "Agents can delete deal matches" ON public.deal_matches
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'agent')
    )
  );

-- Index for faster lookups
CREATE INDEX idx_deal_matches_deal_id ON public.deal_matches(deal_id);
CREATE INDEX idx_deal_matches_contact_id ON public.deal_matches(contact_id);
CREATE INDEX idx_deal_matches_score ON public.deal_matches(match_score DESC);

-- Trigger for updated_at
CREATE TRIGGER update_deal_matches_updated_at
  BEFORE UPDATE ON public.deal_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();