-- Create junction table for investment listing agents
CREATE TABLE public.investment_listing_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.investment_listings(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'exclusive',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(listing_id, agent_id)
);

-- Create junction table for commercial listing agents
CREATE TABLE public.commercial_listing_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.commercial_listings(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'exclusive',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(listing_id, agent_id)
);

-- Enable RLS on both tables
ALTER TABLE public.investment_listing_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_listing_agents ENABLE ROW LEVEL SECURITY;

-- RLS policies for investment_listing_agents
CREATE POLICY "Anyone can view listing agents"
  ON public.investment_listing_agents
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage listing agents"
  ON public.investment_listing_agents
  FOR ALL
  USING (is_admin_or_agent(auth.uid()));

-- RLS policies for commercial_listing_agents
CREATE POLICY "Anyone can view commercial listing agents"
  ON public.commercial_listing_agents
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage commercial listing agents"
  ON public.commercial_listing_agents
  FOR ALL
  USING (is_admin_or_agent(auth.uid()));