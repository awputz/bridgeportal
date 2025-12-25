
-- Update file_type constraint to include canva
ALTER TABLE agent_templates DROP CONSTRAINT IF EXISTS agent_templates_file_type_check;
ALTER TABLE agent_templates ADD CONSTRAINT agent_templates_file_type_check 
  CHECK (file_type IN ('pdf', 'docx', 'xlsx', 'pptx', 'canva', 'link'));
