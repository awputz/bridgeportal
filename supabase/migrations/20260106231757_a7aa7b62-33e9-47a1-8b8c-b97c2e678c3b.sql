-- =============================================
-- FULL-TEXT SEARCH & PERFORMANCE INDEXES
-- =============================================

-- 1. Full-text search on contacts
CREATE INDEX IF NOT EXISTS idx_contacts_fts ON crm_contacts 
USING gin(to_tsvector('english', 
  COALESCE(full_name, '') || ' ' || 
  COALESCE(email, '') || ' ' || 
  COALESCE(company, '') || ' ' ||
  COALESCE(phone, '')
));

-- 2. Full-text search on deals
CREATE INDEX IF NOT EXISTS idx_deals_fts ON crm_deals
USING gin(to_tsvector('english',
  COALESCE(property_address, '') || ' ' ||
  COALESCE(notes, '') || ' ' ||
  COALESCE(tenant_legal_name, '')
));

-- 3. Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_deals_agent_stage_active ON crm_deals(agent_id, stage_id, is_active);
CREATE INDEX IF NOT EXISTS idx_deals_division_stage ON crm_deals(division, stage_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_deals_expected_close ON crm_deals(expected_close) WHERE is_active = true AND expected_close IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_deals_value_desc ON crm_deals(value DESC) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_contacts_agent_division ON crm_contacts(agent_id, division) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_contacts_email_lookup ON crm_contacts(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_last_contact ON crm_contacts(last_contact_date DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_activities_agent_due ON crm_activities(agent_id, due_date) WHERE is_completed = false;
CREATE INDEX IF NOT EXISTS idx_activities_deal_completed ON crm_activities(deal_id, is_completed);

CREATE INDEX IF NOT EXISTS idx_commission_agent_status ON commission_requests(agent_id, status);
CREATE INDEX IF NOT EXISTS idx_commission_closing_date ON commission_requests(closing_date DESC);

-- 4. Add missing foreign key for transaction linking
ALTER TABLE commission_requests 
ADD COLUMN IF NOT EXISTS transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_commission_transaction ON commission_requests(transaction_id) WHERE transaction_id IS NOT NULL;

-- 5. Add missing foreign key for deal-to-contact linking
ALTER TABLE crm_deals
ADD COLUMN IF NOT EXISTS primary_contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_deals_primary_contact ON crm_deals(primary_contact_id) WHERE primary_contact_id IS NOT NULL;

-- 6. Performance: Recreate soft-delete aware indexes
DROP INDEX IF EXISTS idx_crm_contacts_agent;
CREATE INDEX idx_crm_contacts_agent ON crm_contacts(agent_id) WHERE deleted_at IS NULL;

DROP INDEX IF EXISTS idx_crm_deals_agent;
CREATE INDEX idx_crm_deals_agent ON crm_deals(agent_id) WHERE deleted_at IS NULL;