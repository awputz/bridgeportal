-- Data Integrity Migration: Soft deletes, validation constraints, and triggers

-- Add soft delete columns where missing
ALTER TABLE agent_notes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE agent_expenses ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add check constraints for data validation
DO $$ 
BEGIN
  -- Valid deal value (positive or null)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_deal_value') THEN
    ALTER TABLE crm_deals ADD CONSTRAINT valid_deal_value CHECK (value IS NULL OR value > 0);
  END IF;
  
  -- Valid commission amount (positive)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_commission_amount') THEN
    ALTER TABLE commission_requests ADD CONSTRAINT valid_commission_amount CHECK (commission_amount > 0);
  END IF;
  
  -- Valid expense amount (positive)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_expense_amount') THEN
    ALTER TABLE agent_expenses ADD CONSTRAINT valid_expense_amount CHECK (amount > 0);
  END IF;
END $$;

-- Create partial indexes that exclude soft-deleted records for better query performance
CREATE INDEX IF NOT EXISTS idx_crm_deals_active_not_deleted 
  ON crm_deals (agent_id, division, is_active) 
  WHERE deleted_at IS NULL AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_crm_contacts_active_not_deleted 
  ON crm_contacts (agent_id, division, is_active) 
  WHERE deleted_at IS NULL AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_crm_activities_pending_not_deleted 
  ON crm_activities (agent_id, due_date, is_completed) 
  WHERE deleted_at IS NULL AND is_completed = false;

CREATE INDEX IF NOT EXISTS idx_agent_notes_not_deleted 
  ON agent_notes (agent_id, created_at) 
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_agent_expenses_not_deleted 
  ON agent_expenses (agent_id, expense_date) 
  WHERE deleted_at IS NULL;