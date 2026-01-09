-- Phase 5: Performance Analytics & Reporting

-- 1. Create agent_production_sync table to link active agents to transactions
CREATE TABLE public.agent_production_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active_agent_id UUID NOT NULL REFERENCES public.active_agents(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  match_method TEXT NOT NULL CHECK (match_method IN ('email', 'name', 'manual')),
  matched_at TIMESTAMPTZ DEFAULT now(),
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(active_agent_id, transaction_id)
);

-- Enable RLS
ALTER TABLE public.agent_production_sync ENABLE ROW LEVEL SECURITY;

-- RLS policies for agent_production_sync
CREATE POLICY "HR admins can manage production sync"
  ON public.agent_production_sync FOR ALL
  USING (public.is_hr_admin(auth.uid()));

-- 2. Create materialized view for production summary
CREATE MATERIALIZED VIEW public.hr_production_summary AS
SELECT 
  aa.id as active_agent_id,
  aa.full_name,
  aa.division,
  aa.hire_date,
  aa.status,
  COUNT(DISTINCT t.id) as total_deals,
  COALESCE(SUM(COALESCE(t.sale_price, t.total_lease_value, 0)), 0)::NUMERIC as total_volume,
  COALESCE(SUM(COALESCE(t.commission, 0)), 0)::NUMERIC as total_commission,
  MAX(t.closing_date) as last_deal_date,
  -- Post-hire metrics
  COUNT(DISTINCT CASE WHEN t.closing_date >= aa.hire_date THEN t.id END) as deals_since_hire,
  COALESCE(SUM(CASE WHEN t.closing_date >= aa.hire_date THEN COALESCE(t.sale_price, t.total_lease_value, 0) END), 0)::NUMERIC as volume_since_hire,
  COALESCE(SUM(CASE WHEN t.closing_date >= aa.hire_date THEN COALESCE(t.commission, 0) END), 0)::NUMERIC as commission_since_hire
FROM public.active_agents aa
LEFT JOIN public.agent_production_sync aps ON aa.id = aps.active_agent_id
LEFT JOIN public.transactions t ON aps.transaction_id = t.id
GROUP BY aa.id, aa.full_name, aa.division, aa.hire_date, aa.status;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX hr_production_summary_agent_idx ON public.hr_production_summary(active_agent_id);

-- 3. Create refresh function
CREATE OR REPLACE FUNCTION public.refresh_hr_production_summary()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.hr_production_summary;
$$;

-- 4. Create function to auto-match transactions to agents
CREATE OR REPLACE FUNCTION public.sync_agent_transactions_by_name(p_active_agent_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_agent_name TEXT;
  v_agent_email TEXT;
  v_matched_count INTEGER := 0;
BEGIN
  -- Get agent details
  SELECT full_name, email INTO v_agent_name, v_agent_email
  FROM public.active_agents WHERE id = p_active_agent_id;
  
  IF v_agent_name IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Match by name (case-insensitive partial match)
  INSERT INTO public.agent_production_sync (active_agent_id, transaction_id, match_method)
  SELECT p_active_agent_id, t.id, 'name'
  FROM public.transactions t
  WHERE t.agent_name ILIKE '%' || v_agent_name || '%'
    AND NOT EXISTS (
      SELECT 1 FROM public.agent_production_sync aps 
      WHERE aps.transaction_id = t.id AND aps.active_agent_id = p_active_agent_id
    )
  ON CONFLICT (active_agent_id, transaction_id) DO NOTHING;
  
  GET DIAGNOSTICS v_matched_count = ROW_COUNT;
  
  -- Also try matching by email prefix if available
  IF v_agent_email IS NOT NULL THEN
    INSERT INTO public.agent_production_sync (active_agent_id, transaction_id, match_method)
    SELECT p_active_agent_id, t.id, 'email'
    FROM public.transactions t
    WHERE t.agent_name ILIKE '%' || split_part(v_agent_email, '@', 1) || '%'
      AND NOT EXISTS (
        SELECT 1 FROM public.agent_production_sync aps 
        WHERE aps.transaction_id = t.id AND aps.active_agent_id = p_active_agent_id
      )
    ON CONFLICT (active_agent_id, transaction_id) DO NOTHING;
    
    v_matched_count := v_matched_count + ROW_COUNT;
  END IF;
  
  RETURN v_matched_count;
END;
$$;

-- 5. Add audit trigger
CREATE TRIGGER audit_agent_production_sync
  AFTER INSERT OR UPDATE OR DELETE ON public.agent_production_sync
  FOR EACH ROW EXECUTE FUNCTION public.log_hr_changes();