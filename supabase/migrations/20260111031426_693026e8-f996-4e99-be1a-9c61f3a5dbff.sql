-- Step 1: Add category and version columns
ALTER TABLE agent_templates ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE agent_templates ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';

-- Step 2: Update the division check constraint to include 'all'
ALTER TABLE agent_templates DROP CONSTRAINT IF EXISTS agent_templates_division_check;
ALTER TABLE agent_templates ADD CONSTRAINT agent_templates_division_check 
  CHECK (division = ANY (ARRAY['investment-sales'::text, 'commercial-leasing'::text, 'residential'::text, 'marketing'::text, 'all'::text]));