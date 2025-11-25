-- Create team_members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  image_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('leadership', 'sales_team')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_team_members_category ON team_members(category);
CREATE INDEX idx_team_members_display_order ON team_members(display_order);
CREATE INDEX idx_team_members_is_active ON team_members(is_active);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins and agents can view all team members"
  ON team_members FOR SELECT
  USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Admins and agents can insert team members"
  ON team_members FOR INSERT
  WITH CHECK (is_admin_or_agent(auth.uid()));

CREATE POLICY "Admins and agents can update team members"
  ON team_members FOR UPDATE
  USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Admins and agents can delete team members"
  ON team_members FOR DELETE
  USING (is_admin_or_agent(auth.uid()));

-- Insert existing team data
INSERT INTO team_members (name, title, bio, email, phone, instagram_url, linkedin_url, category, display_order, is_active) VALUES
-- Leadership
('Zach Putnam', 'Principal', 'Zach Putnam is a co-founder of Bridge Investment Sales and specializes in the sale of multifamily, mixed-use, and development sites across New York City. With a strong focus on Brooklyn, Zach has established himself as a trusted advisor to both local and institutional investors. His expertise spans pricing strategy, market analysis, and deal structuring, ensuring optimal outcomes for his clients. Known for his analytical approach and deep market knowledge, Zach has successfully closed transactions ranging from small portfolio deals to large-scale institutional sales.', 'zach@bridgenyre.com', NULL, 'https://instagram.com/zachputnam', 'https://linkedin.com/in/zachputnam', 'leadership', 0, true),
('Howard Raber', 'Principal', 'Howard Raber is a co-founder of Bridge Investment Sales and brings decades of experience in commercial real estate investment and brokerage. His career includes successful ventures in property acquisition, development, and asset management across multiple markets. Howard''s strategic vision and operational expertise have been instrumental in building Bridge into a leading boutique firm. He specializes in complex transactions, joint ventures, and portfolio sales, leveraging his extensive network and market insights to deliver exceptional value for clients.', 'howard@bridgenyre.com', NULL, NULL, 'https://linkedin.com/in/howardraber', 'leadership', 1, true),
('Hayden Raber', 'Principal', 'Hayden Raber is a co-founder of Bridge Investment Sales and focuses on emerging neighborhoods and value-add opportunities throughout New York City. With a keen eye for market trends and development potential, Hayden has helped numerous investors identify and acquire high-performing assets. His approach combines traditional market fundamentals with innovative marketing strategies, including digital campaigns and targeted outreach. Hayden''s expertise in off-market transactions and his ability to connect buyers and sellers have made him a go-to advisor for sophisticated investors.', 'hayden@bridgenyre.com', NULL, NULL, 'https://linkedin.com/in/haydenraber', 'leadership', 2, true),
-- Sales Team
('Chase Putnam', 'Investment Sales Associate', NULL, 'chase@bridgenyre.com', '(917) 450-2990', NULL, 'https://linkedin.com/in/chaseputnam', 'sales_team', 3, true),
('Matt Palmer', 'Investment Sales Associate', NULL, 'matt@bridgenyre.com', '(516) 459-3850', NULL, 'https://linkedin.com/in/mattpalmer', 'sales_team', 4, true),
('Jason Berkowitz', 'Investment Sales Associate', NULL, 'jason@bridgenyre.com', '(917) 715-4421', NULL, 'https://linkedin.com/in/jasonberkowitz', 'sales_team', 5, true),
('Ethan Schor', 'Investment Sales Associate', NULL, 'ethan@bridgenyre.com', '(516) 639-0043', NULL, 'https://linkedin.com/in/ethanschor', 'sales_team', 6, true),
('Mike Bello', 'Investment Sales Associate', NULL, 'mike@bridgenyre.com', '(917) 584-2376', NULL, 'https://linkedin.com/in/mikebello', 'sales_team', 7, true),
('Max Goldberg', 'Investment Sales Associate', NULL, 'max@bridgenyre.com', '(516) 987-6543', NULL, 'https://linkedin.com/in/maxgoldberg', 'sales_team', 8, true),
('Sam Weinstein', 'Investment Sales Associate', NULL, 'sam@bridgenyre.com', '(646) 555-7890', NULL, 'https://linkedin.com/in/samweinstein', 'sales_team', 9, true),
('Jake Morrison', 'Investment Sales Associate', NULL, 'jake@bridgenyre.com', '(917) 555-1234', NULL, 'https://linkedin.com/in/jakemorrison', 'sales_team', 10, true);