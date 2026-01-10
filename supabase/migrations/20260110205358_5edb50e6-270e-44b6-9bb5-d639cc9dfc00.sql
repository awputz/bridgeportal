-- STEP 1: Extend agent_templates table with fillable template support
ALTER TABLE agent_templates 
ADD COLUMN IF NOT EXISTS is_fillable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS form_schema JSONB,
ADD COLUMN IF NOT EXISTS fill_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;

COMMENT ON COLUMN agent_templates.form_schema IS 'JSON schema defining fillable fields for this template';
COMMENT ON COLUMN agent_templates.is_fillable IS 'Whether this template can be filled in-app';
COMMENT ON COLUMN agent_templates.fill_count IS 'Number of times this template has been filled';
COMMENT ON COLUMN agent_templates.download_count IS 'Number of times this template has been downloaded';

-- STEP 2: Create filled_templates table for storing user-filled template instances
CREATE TABLE filled_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES agent_templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
  
  -- Filled data
  form_data JSONB NOT NULL DEFAULT '{}',
  
  -- Generated document
  generated_file_url TEXT,
  generated_file_name TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'sent_for_signature')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on filled_templates
ALTER TABLE filled_templates ENABLE ROW LEVEL SECURITY;

-- Users can manage their own filled templates, admins can see all
CREATE POLICY "Users manage own filled templates" ON filled_templates
  FOR ALL USING (
    user_id = auth.uid()
    OR public.is_admin_user(auth.uid())
  );

-- Indexes for performance
CREATE INDEX idx_filled_templates_user_id ON filled_templates(user_id);
CREATE INDEX idx_filled_templates_template_id ON filled_templates(template_id);
CREATE INDEX idx_filled_templates_deal_id ON filled_templates(deal_id);

-- Trigger for updated_at
CREATE TRIGGER update_filled_templates_updated_at
  BEFORE UPDATE ON filled_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 3: Create counter RPC functions
CREATE OR REPLACE FUNCTION increment_template_fill_count(p_template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE agent_templates 
  SET fill_count = COALESCE(fill_count, 0) + 1
  WHERE id = p_template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_template_download_count(p_template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE agent_templates 
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = p_template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;