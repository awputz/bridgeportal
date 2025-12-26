-- =====================================================
-- BACKEND HARDENING: Database Views and Functions
-- =====================================================

-- 1. Create investor_dashboard_stats view for optimized single-query metrics
CREATE OR REPLACE VIEW public.investor_dashboard_stats AS
SELECT 
  COUNT(DISTINCT t.id) as total_transactions,
  COALESCE(SUM(t.sale_price), 0)::numeric as total_volume,
  COALESCE(SUM(t.commission), 0)::numeric as total_commissions,
  CASE WHEN COUNT(DISTINCT t.id) > 0 
    THEN COALESCE(SUM(t.sale_price), 0) / COUNT(DISTINCT t.id) 
    ELSE 0 
  END::numeric as avg_deal_size,
  (SELECT COUNT(*) FROM public.team_members WHERE is_active = true)::bigint as active_agents,
  (
    (SELECT COUNT(*) FROM public.investment_listings WHERE is_active = true) +
    (SELECT COUNT(*) FROM public.commercial_listings WHERE is_active = true)
  )::bigint as active_listings,
  -- YTD metrics
  COUNT(DISTINCT CASE 
    WHEN EXTRACT(YEAR FROM t.closing_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
    THEN t.id 
  END)::bigint as ytd_transactions,
  COALESCE(SUM(CASE 
    WHEN EXTRACT(YEAR FROM t.closing_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
    THEN t.sale_price 
  END), 0)::numeric as ytd_volume,
  -- Previous year metrics
  COUNT(DISTINCT CASE 
    WHEN EXTRACT(YEAR FROM t.closing_date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1 
    THEN t.id 
  END)::bigint as prev_year_transactions,
  COALESCE(SUM(CASE 
    WHEN EXTRACT(YEAR FROM t.closing_date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1 
    THEN t.sale_price 
  END), 0)::numeric as prev_year_volume
FROM public.transactions t;

-- Grant access to the view
GRANT SELECT ON public.investor_dashboard_stats TO authenticated;

-- 2. Create division breakdown view
CREATE OR REPLACE VIEW public.division_breakdown_stats AS
SELECT 
  COALESCE(division, 'Other') as division_name,
  COUNT(*) as transaction_count,
  COALESCE(SUM(sale_price), 0)::numeric as total_volume,
  COALESCE(SUM(commission), 0)::numeric as total_commission
FROM public.transactions
GROUP BY COALESCE(division, 'Other')
ORDER BY total_volume DESC;

GRANT SELECT ON public.division_breakdown_stats TO authenticated;

-- 3. Create agent performance view
CREATE OR REPLACE VIEW public.agent_performance_stats AS
SELECT 
  agent_name,
  COUNT(*) as deal_count,
  COALESCE(SUM(sale_price), 0)::numeric as total_volume,
  COALESCE(SUM(commission), 0)::numeric as total_commission,
  CASE WHEN COUNT(*) > 0 
    THEN COALESCE(SUM(sale_price), 0) / COUNT(*) 
    ELSE 0 
  END::numeric as avg_deal_size,
  array_agg(DISTINCT division) FILTER (WHERE division IS NOT NULL) as divisions
FROM public.transactions
WHERE agent_name IS NOT NULL
GROUP BY agent_name
ORDER BY total_volume DESC;

GRANT SELECT ON public.agent_performance_stats TO authenticated;

-- 4. Create function to get agent transactions with fuzzy name matching
CREATE OR REPLACE FUNCTION public.get_agent_transactions(
  p_agent_email text,
  p_agent_full_name text
)
RETURNS SETOF public.transactions
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_email_name text;
  v_name_parts text[];
BEGIN
  -- Extract name parts
  v_name_parts := string_to_array(p_agent_full_name, ' ');
  v_first_name := v_name_parts[1];
  v_last_name := v_name_parts[array_length(v_name_parts, 1)];
  v_email_name := split_part(p_agent_email, '@', 1);
  
  RETURN QUERY
  SELECT DISTINCT ON (id) *
  FROM public.transactions
  WHERE 
    -- Exact full name match
    agent_name ILIKE '%' || p_agent_full_name || '%'
    -- First + Last name pattern
    OR agent_name ILIKE '%' || v_first_name || '%' || v_last_name || '%'
    -- Last name only (for "Smith, Jones" style)
    OR agent_name ILIKE '%' || v_last_name || '%'
    -- Email-based name match
    OR agent_name ILIKE '%' || REPLACE(REPLACE(v_email_name, '.', ' '), '_', ' ') || '%'
  ORDER BY id, closing_date DESC NULLS LAST;
END;
$$;

-- Grant execute on the function
GRANT EXECUTE ON FUNCTION public.get_agent_transactions(text, text) TO authenticated;

-- 5. Create pending counts view for quick investor dashboard
CREATE OR REPLACE VIEW public.pending_counts_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.agent_requests WHERE status = 'pending')::bigint as pending_agent_requests,
  (SELECT COUNT(*) FROM public.commission_requests WHERE status = 'pending')::bigint as pending_commission_requests,
  (SELECT COUNT(*) FROM public.agent_requests WHERE status = 'pending' AND priority = 'high')::bigint as high_priority_requests;

GRANT SELECT ON public.pending_counts_stats TO authenticated;