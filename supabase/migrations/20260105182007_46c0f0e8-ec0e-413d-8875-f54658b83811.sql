-- Add division column to crm_activities
ALTER TABLE crm_activities 
ADD COLUMN IF NOT EXISTS division TEXT DEFAULT 'investment-sales';

-- Add other task-related columns that exist in the Task interface but not in the table
ALTER TABLE crm_activities 
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS reminder_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS recurring_pattern TEXT,
ADD COLUMN IF NOT EXISTS is_all_day BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'task';

-- Update existing activities to get division from linked deals
UPDATE crm_activities a
SET division = d.division
FROM crm_deals d
WHERE a.deal_id = d.id AND a.division IS NULL;

-- Update remaining activities to get division from linked contacts
UPDATE crm_activities a
SET division = c.division
FROM crm_contacts c
WHERE a.contact_id = c.id AND a.division IS NULL AND a.deal_id IS NULL;

-- Create function to auto-set division based on linked deal/contact
CREATE OR REPLACE FUNCTION set_activity_division()
RETURNS TRIGGER AS $$
BEGIN
  -- If division is explicitly set, keep it
  IF NEW.division IS NOT NULL AND NEW.division != 'investment-sales' THEN
    RETURN NEW;
  END IF;
  
  -- Try to get division from linked deal
  IF NEW.deal_id IS NOT NULL THEN
    SELECT division INTO NEW.division 
    FROM crm_deals WHERE id = NEW.deal_id;
  -- Otherwise try from linked contact
  ELSIF NEW.contact_id IS NOT NULL THEN
    SELECT division INTO NEW.division 
    FROM crm_contacts WHERE id = NEW.contact_id;
  END IF;
  
  -- Default to investment-sales if still null
  IF NEW.division IS NULL THEN
    NEW.division := 'investment-sales';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-assignment on insert/update
DROP TRIGGER IF EXISTS trigger_set_activity_division ON crm_activities;
CREATE TRIGGER trigger_set_activity_division
  BEFORE INSERT OR UPDATE ON crm_activities
  FOR EACH ROW
  EXECUTE FUNCTION set_activity_division();

-- Create index for division filtering
CREATE INDEX IF NOT EXISTS idx_crm_activities_division ON crm_activities(division);
CREATE INDEX IF NOT EXISTS idx_crm_activities_agent_division ON crm_activities(agent_id, division);