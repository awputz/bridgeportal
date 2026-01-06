-- =============================================
-- FIX SECURITY DEFINER VIEWS
-- =============================================

-- Drop and recreate views with SECURITY INVOKER
DROP VIEW IF EXISTS division_performance_live;
DROP VIEW IF EXISTS agent_pipeline_by_stage;
DROP VIEW IF EXISTS agent_monthly_performance;

-- 2. Division Performance View (SECURITY INVOKER)
CREATE VIEW division_performance_live 
WITH (security_invoker = true)
AS
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

-- 3. Pipeline Summary by Stage (SECURITY INVOKER)
CREATE VIEW agent_pipeline_by_stage
WITH (security_invoker = true)
AS
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

-- 4. Monthly Performance Tracking (SECURITY INVOKER)
CREATE VIEW agent_monthly_performance
WITH (security_invoker = true)
AS
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

-- =============================================
-- MISSING TABLES
-- =============================================

-- 1. Deal Stage History (track pipeline movement)
CREATE TABLE IF NOT EXISTS crm_deal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES crm_deals(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  old_stage_id UUID REFERENCES crm_deal_stages(id),
  new_stage_id UUID REFERENCES crm_deal_stages(id),
  changed_by UUID NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_deal_history_deal ON crm_deal_history(deal_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_history_changed_by ON crm_deal_history(changed_by);

ALTER TABLE crm_deal_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agents view deal history for accessible deals" ON crm_deal_history;
CREATE POLICY "Agents view deal history for accessible deals"
ON crm_deal_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM crm_deals d
    WHERE d.id = crm_deal_history.deal_id
    AND (d.agent_id = auth.uid() OR public.is_admin_user(auth.uid()))
  )
);

DROP POLICY IF EXISTS "System can insert deal history" ON crm_deal_history;
CREATE POLICY "System can insert deal history"
ON crm_deal_history FOR INSERT
WITH CHECK (true);

-- Auto-log stage changes
CREATE OR REPLACE FUNCTION log_deal_stage_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.stage_id IS DISTINCT FROM NEW.stage_id THEN
    INSERT INTO crm_deal_history (
      deal_id, field_name, old_stage_id, new_stage_id, changed_by
    ) VALUES (
      NEW.id, 'stage', OLD.stage_id, NEW.stage_id, COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS track_deal_stage_changes ON crm_deals;
CREATE TRIGGER track_deal_stage_changes
  AFTER UPDATE ON crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION log_deal_stage_change();

-- 2. Document Categories
CREATE TABLE IF NOT EXISTS document_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_category_id UUID REFERENCES document_categories(id),
  color TEXT DEFAULT 'gray',
  icon TEXT DEFAULT 'Folder',
  division TEXT CHECK (division IS NULL OR division IN ('investment-sales', 'commercial-leasing', 'residential')),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_categories_division ON document_categories(division);

ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active categories" ON document_categories;
CREATE POLICY "Anyone can view active categories"
ON document_categories FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage categories" ON document_categories;
CREATE POLICY "Admins manage categories"
ON document_categories FOR ALL
USING (public.is_admin_user(auth.uid()));

-- Seed default categories (only if empty)
INSERT INTO document_categories (name, description, division, display_order)
SELECT * FROM (VALUES
  ('Contracts', 'Purchase agreements, leases, LOIs', NULL::TEXT, 1),
  ('Financial', 'Rent rolls, operating statements, tax returns', 'investment-sales', 2),
  ('Property Info', 'Floor plans, photos, surveys', NULL::TEXT, 3),
  ('Legal', 'Deeds, title reports, litigation', NULL::TEXT, 4),
  ('Marketing', 'OMs, flyers, brochures', NULL::TEXT, 5),
  ('Due Diligence', 'Inspections, appraisals, environmental', 'investment-sales', 6),
  ('Tenant Files', 'Leases, estoppels, tenant info', 'commercial-leasing', 7),
  ('Disclosures', 'Property condition, lead paint, etc', 'residential', 8)
) AS v(name, description, division, display_order)
WHERE NOT EXISTS (SELECT 1 FROM document_categories LIMIT 1);