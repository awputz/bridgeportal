-- =============================================
-- DATA INTEGRITY & SOFT DELETES (Run First)
-- =============================================

-- 1. Add soft delete columns to tables
ALTER TABLE crm_contacts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE crm_deals ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE crm_activities ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE agent_notes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE agent_expenses ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Add check constraints (use DO blocks to handle existing constraints)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_deal_value') THEN
    ALTER TABLE crm_deals ADD CONSTRAINT valid_deal_value CHECK (value IS NULL OR value > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_commission') THEN
    ALTER TABLE commission_requests ADD CONSTRAINT valid_commission CHECK (commission_amount > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_expense') THEN
    ALTER TABLE agent_expenses ADD CONSTRAINT valid_expense CHECK (amount > 0);
  END IF;
END $$;

-- 3. Add default values where missing
ALTER TABLE crm_contacts ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE crm_deals ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE crm_activities ALTER COLUMN created_at SET DEFAULT NOW();

-- 4. Create validation function for phone numbers
CREATE OR REPLACE FUNCTION is_valid_phone(phone_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Allow NULL, empty, or valid phone formats
  RETURN phone_number IS NULL 
    OR phone_number = '' 
    OR phone_number ~ '^\+?[0-9\s\-\(\)\.]+$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 5. Auto-update last_contact_date on activity creation
CREATE OR REPLACE FUNCTION update_contact_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contact_id IS NOT NULL THEN
    UPDATE crm_contacts 
    SET last_contact_date = NOW()
    WHERE id = NEW.contact_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_contact_last_activity_trigger ON crm_activities;
CREATE TRIGGER update_contact_last_activity_trigger
  AFTER INSERT ON crm_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_last_activity();

-- 6. Auto-update deal last_activity_date
CREATE OR REPLACE FUNCTION update_deal_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deal_id IS NOT NULL THEN
    UPDATE crm_deals 
    SET last_activity_date = NOW()
    WHERE id = NEW.deal_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_deal_last_activity_trigger ON crm_activities;
CREATE TRIGGER update_deal_last_activity_trigger
  AFTER INSERT OR UPDATE ON crm_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_deal_last_activity();