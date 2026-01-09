-- Update agent_compliance FK to reference new agents table
ALTER TABLE agent_compliance DROP CONSTRAINT IF EXISTS agent_compliance_active_agent_id_fkey;

ALTER TABLE agent_compliance 
ADD CONSTRAINT agent_compliance_active_agent_id_fkey 
FOREIGN KEY (active_agent_id) REFERENCES agents(id) ON DELETE CASCADE;

-- Update agent_onboarding FK to reference new agents table
ALTER TABLE agent_onboarding DROP CONSTRAINT IF EXISTS agent_onboarding_active_agent_id_fkey;

ALTER TABLE agent_onboarding 
ADD CONSTRAINT agent_onboarding_active_agent_id_fkey 
FOREIGN KEY (active_agent_id) REFERENCES agents(id) ON DELETE CASCADE;