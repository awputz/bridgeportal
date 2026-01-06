-- =============================================
-- PERFORMANCE VIEWS FOR AGENT DASHBOARDS
-- =============================================

-- 1. Agent Dashboard Stats (Materialized View for Speed)
CREATE MATERIALIZED VIEW agent_dashboard_stats AS
SELECT 
  p.id as agent_id,
  p.full_name as agent_name,
  p.email as agent_email,
  ur.assigned_division as division,
  
  -- Deal counts
  COUNT(DISTINCT d.id) FILTER (WHERE d.is_active = true AND d.deleted_at IS NULL) as active_deals,
  COUNT(DISTINCT d.id) FILTER (WHERE d.won = true) as won_deals,
  COUNT(DISTINCT d.id) FILTER (WHERE d.is_lost = true) as lost_deals,
  
  -- Pipeline value
  COALESCE(SUM(d.value) FILTER (WHERE d.is_active = true AND d.deleted_at IS NULL), 0) as pipeline_value,
  COALESCE(AVG(d.value) FILTER (WHERE d.is_active = true AND d.deleted_at IS NULL), 0) as avg_deal_size,
  
  -- Contact stats
  COUNT(DISTINCT c.id) FILTER (WHERE c.is_active = true AND c.deleted_at IS NULL) as total_contacts,
  
  -- Activity stats
  COUNT(DISTINCT a.id) FILTER (WHERE a.is_completed = false AND a.due_date >= NOW()) as upcoming_tasks,
  COUNT(DISTINCT a.id) FILTER (WHERE a.is_completed = false AND a.due_date < NOW()) as overdue_tasks,
  
  -- Commission stats
  COALESCE(SUM(cr.commission_amount) FILTER (WHERE cr.status = 'paid'), 0) as total_commissions_paid,
  COALESCE(SUM(cr.commission_amount) FILTER (WHERE cr.status IN ('pending', 'under_review', 'approved')), 0) as pending_commissions,
  
  -- Timestamps
  MAX(d.updated_at) as last_deal_update,
  MAX(c.updated_at) as last_contact_update,
  NOW() as refreshed_at
FROM profiles p
LEFT JOIN user_roles ur ON ur.user_id = p.id
LEFT JOIN crm_deals d ON d.agent_id = p.id
LEFT JOIN crm_contacts c ON c.agent_id = p.id
LEFT JOIN crm_activities a ON a.agent_id = p.id
LEFT JOIN commission_requests cr ON cr.agent_id = p.id
WHERE ur.role IN ('agent', 'admin')
GROUP BY p.id, p.full_name, p.email, ur.assigned_division;

-- Create index for fast lookups
CREATE UNIQUE INDEX idx_agent_dashboard_stats_agent ON agent_dashboard_stats(agent_id);

-- Grant access
GRANT SELECT ON agent_dashboard_stats TO authenticated;

-- Refresh function (call daily via cron)
CREATE OR REPLACE FUNCTION refresh_agent_dashboard_stats()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY agent_dashboard_stats;
$$;

-- 2. Division Performance View
CREATE VIEW division_performance_live AS
SELECT 
  d.division,
  COUNT(DISTINCT d.id) as total_deals,
  COUNT(DISTINCT d.id) FILTER (WHERE d.won = true) as won_deals,
  COALESCE(SUM(d.value), 0) as total_pipeline_value,
  COUNT(DISTINCT d.agent_id) as active_agents,
  COUNT(DISTINCT c.id) as total_contacts
FROM crm_deals d
LEFT JOIN crm_contacts c ON c.division = d.division AND c.is_active = true
WHERE d.is_active = true
GROUP BY d.division;

GRANT SELECT ON division_performance_live TO authenticated;

-- 3. Pipeline Summary by Stage
CREATE VIEW agent_pipeline_by_stage AS
SELECT 
  d.agent_id,
  d.division,
  s.name as stage_name,
  s.id as stage_id,
  s.color as stage_color,
  s.display_order,
  COUNT(d.id) as deal_count,
  COALESCE(SUM(d.value), 0) as stage_value
FROM crm_deals d
JOIN crm_deal_stages s ON s.id = d.stage_id
WHERE d.is_active = true
GROUP BY d.agent_id, d.division, s.name, s.id, s.color, s.display_order;

GRANT SELECT ON agent_pipeline_by_stage TO authenticated;

-- 4. Monthly Performance Tracking
CREATE VIEW agent_monthly_performance AS
SELECT 
  d.agent_id,
  d.division,
  DATE_TRUNC('month', d.created_at) as month,
  COUNT(d.id) as deals_created,
  COUNT(d.id) FILTER (WHERE d.won = true) as deals_won,
  COALESCE(SUM(d.value) FILTER (WHERE d.won = true), 0) as revenue,
  COALESCE(SUM(d.commission), 0) as commissions_earned
FROM crm_deals d
WHERE d.created_at >= NOW() - INTERVAL '12 months'
GROUP BY d.agent_id, d.division, DATE_TRUNC('month', d.created_at);

GRANT SELECT ON agent_monthly_performance TO authenticated;