
-- Drop the existing constraint and add new one with marketing
ALTER TABLE agent_templates DROP CONSTRAINT IF EXISTS agent_templates_division_check;
ALTER TABLE agent_templates ADD CONSTRAINT agent_templates_division_check 
  CHECK (division IN ('investment-sales', 'commercial-leasing', 'residential', 'marketing'));
