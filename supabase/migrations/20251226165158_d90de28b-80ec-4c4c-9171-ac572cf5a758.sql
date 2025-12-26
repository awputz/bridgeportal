-- Fix SECURITY DEFINER views - convert to SECURITY INVOKER
-- This ensures views respect the querying user's RLS policies

-- Drop and recreate views with proper security settings
DROP VIEW IF EXISTS public.investor_dashboard_stats;
DROP VIEW IF EXISTS public.division_breakdown_stats;
DROP VIEW IF EXISTS public.agent_performance_stats;
DROP VIEW IF EXISTS public.pending_counts_stats;

-- 1. Recreate investor_dashboard_stats with SECURITY INVOKER (default)
CREATE VIEW public.investor_dashboard_stats 
WITH (security_invoker = true)
AS
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
  COUNT(DISTINCT CASE 
    WHEN EXTRACT(YEAR FROM t.closing_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
    THEN t.id 
  END)::bigint as ytd_transactions,
  COALESCE(SUM(CASE 
    WHEN EXTRACT(YEAR FROM t.closing_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
    THEN t.sale_price 
  END), 0)::numeric as ytd_volume,
  COUNT(DISTINCT CASE 
    WHEN EXTRACT(YEAR FROM t.closing_date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1 
    THEN t.id 
  END)::bigint as prev_year_transactions,
  COALESCE(SUM(CASE 
    WHEN EXTRACT(YEAR FROM t.closing_date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1 
    THEN t.sale_price 
  END), 0)::numeric as prev_year_volume
FROM public.transactions t;

GRANT SELECT ON public.investor_dashboard_stats TO authenticated;

-- 2. Recreate division_breakdown_stats with SECURITY INVOKER
CREATE VIEW public.division_breakdown_stats 
WITH (security_invoker = true)
AS
SELECT 
  COALESCE(division, 'Other') as division_name,
  COUNT(*) as transaction_count,
  COALESCE(SUM(sale_price), 0)::numeric as total_volume,
  COALESCE(SUM(commission), 0)::numeric as total_commission
FROM public.transactions
GROUP BY COALESCE(division, 'Other')
ORDER BY total_volume DESC;

GRANT SELECT ON public.division_breakdown_stats TO authenticated;

-- 3. Recreate agent_performance_stats with SECURITY INVOKER
CREATE VIEW public.agent_performance_stats 
WITH (security_invoker = true)
AS
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

-- 4. Recreate pending_counts_stats with SECURITY INVOKER
CREATE VIEW public.pending_counts_stats 
WITH (security_invoker = true)
AS
SELECT 
  (SELECT COUNT(*) FROM public.agent_requests WHERE status = 'pending')::bigint as pending_agent_requests,
  (SELECT COUNT(*) FROM public.commission_requests WHERE status = 'pending')::bigint as pending_commission_requests,
  (SELECT COUNT(*) FROM public.agent_requests WHERE status = 'pending' AND priority = 'high')::bigint as high_priority_requests;

GRANT SELECT ON public.pending_counts_stats TO authenticated;