-- Performance indexes for common investor queries
-- Index on transactions closing_date for date-range filtering
CREATE INDEX IF NOT EXISTS idx_transactions_closing_date ON public.transactions(closing_date DESC);

-- Index on transactions division for filtering by division
CREATE INDEX IF NOT EXISTS idx_transactions_division ON public.transactions(division);

-- Index on agent_requests status for filtering pending requests
CREATE INDEX IF NOT EXISTS idx_agent_requests_status ON public.agent_requests(status);

-- Index on agent_requests created_at for ordering
CREATE INDEX IF NOT EXISTS idx_agent_requests_created_at ON public.agent_requests(created_at DESC);

-- Index on commission_requests status for filtering
CREATE INDEX IF NOT EXISTS idx_commission_requests_status ON public.commission_requests(status);

-- Index on commission_requests created_at for ordering
CREATE INDEX IF NOT EXISTS idx_commission_requests_created_at ON public.commission_requests(created_at DESC);

-- Index on investment_listings is_active for active listings queries
CREATE INDEX IF NOT EXISTS idx_investment_listings_is_active ON public.investment_listings(is_active) WHERE is_active = true;

-- Index on commercial_listings is_active for active listings queries
CREATE INDEX IF NOT EXISTS idx_commercial_listings_is_active ON public.commercial_listings(is_active) WHERE is_active = true;

-- Index on team_members is_active for active team queries
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active) WHERE is_active = true;

-- Enable realtime for investor-relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.commission_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.investment_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.commercial_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;