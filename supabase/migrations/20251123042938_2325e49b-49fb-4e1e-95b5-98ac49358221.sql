-- Add investment sales specific fields to properties table (now investment offerings)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cap_rate numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS gross_square_feet integer;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS units integer;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS asset_type text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS offering_status text DEFAULT 'active';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_on_request boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS brief_highlights text;

-- Update transactions table for investment sales track record
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS price_per_unit numeric;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS price_per_sf numeric;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS role text DEFAULT 'seller_representation';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS year integer;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS gross_square_feet integer;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS units integer;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS sale_price numeric;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS asset_type text;

-- Create research notes table
CREATE TABLE IF NOT EXISTS research_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category text,
  summary text,
  content text,
  download_link text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on research_notes
ALTER TABLE research_notes ENABLE ROW LEVEL SECURITY;

-- Anyone can view research notes
CREATE POLICY "Anyone can view research notes"
ON research_notes
FOR SELECT
USING (true);

-- Admins and agents can manage research notes
CREATE POLICY "Admins and agents can manage research notes"
ON research_notes
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- Add trigger for research_notes updated_at
CREATE TRIGGER update_research_notes_updated_at
BEFORE UPDATE ON research_notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update inquiries table for investment sales
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS property_type text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS approximate_size text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS current_situation text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS inquiry_type text DEFAULT 'general';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS target_asset_type text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS target_boroughs text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS budget_range text;