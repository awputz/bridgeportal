-- Create template_categories table
CREATE TABLE IF NOT EXISTS template_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE template_categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read categories (they're reference data)
CREATE POLICY "Anyone can read template categories"
  ON template_categories FOR SELECT
  USING (true);

-- Seed the 8 categories
INSERT INTO template_categories (id, name, description, icon, display_order) VALUES
  ('commission-agreements', 'Commission Agreements', 'Sales commission and schedule templates', 'DollarSign', 1),
  ('lois', 'Letters of Intent', 'LOI templates for residential, commercial, and investment sales', 'FileText', 2),
  ('exclusive-agreements', 'Exclusive Agreements', 'Buyer agency, listing agreements, and tenant rep contracts', 'FileCheck', 3),
  ('referral-agreements', 'Referral Agreements', 'Agent and broker referral templates', 'Users', 4),
  ('leases', 'Lease Templates', 'Residential and commercial lease documents', 'Home', 5),
  ('co-broke', 'Co-Broke Agreements', 'Co-brokerage and split commission agreements', 'Handshake', 6),
  ('nda', 'NDAs', 'Non-disclosure and confidentiality agreements', 'Lock', 7),
  ('email-templates', 'Email Templates', 'Standard email templates for client communication', 'Mail', 8)
ON CONFLICT (id) DO NOTHING;

-- Insert the 14 new templates
INSERT INTO agent_templates (name, description, division, category, file_type, file_url, version, is_active, is_fillable, display_order) VALUES
  ('Investment Sales Commission Agreement', 'Standard commission agreement for investment sales transactions', 'investment-sales', 'commission-agreements', 'pdf', '', '1.0', true, false, 100),
  ('Commission Schedule (Commercial)', 'Commercial division commission schedule and rates', 'commercial-leasing', 'commission-agreements', 'pdf', '', '1.0', true, false, 101),
  ('Residential LOI Template', 'Letter of Intent for residential purchase offers', 'residential', 'lois', 'pdf', '', '1.0', true, true, 102),
  ('Commercial LOI Template', 'Letter of Intent for commercial lease or purchase', 'commercial-leasing', 'lois', 'pdf', '', '1.0', true, true, 103),
  ('Investment Sales LOI Template', 'Letter of Intent for investment property acquisitions', 'investment-sales', 'lois', 'pdf', '', '1.0', true, true, 104),
  ('Investment Sales Exclusive Buyer Agency Agreement', 'Exclusive buyer representation for investment property purchases', 'investment-sales', 'exclusive-agreements', 'pdf', '', '1.0', true, true, 105),
  ('Investment Sales Exclusive (Short Form)', 'Abbreviated exclusive agreement for investment sales', 'investment-sales', 'exclusive-agreements', 'pdf', '', '1.0', true, false, 106),
  ('Listing Agreements', 'Standard property listing agreement templates', 'all', 'exclusive-agreements', 'pdf', '', '1.0', true, true, 107),
  ('Tenant Rep Agreement', 'Tenant representation agreement for commercial leasing', 'commercial-leasing', 'exclusive-agreements', 'pdf', '', '1.0', true, true, 108),
  ('Referral Agreement', 'Standard agent/broker referral fee agreement', 'all', 'referral-agreements', 'pdf', '', '1.0', true, true, 109),
  ('Residential Lease', 'Standard residential lease agreement', 'residential', 'leases', 'pdf', '', '1.0', true, true, 110),
  ('Co-Broke Agreement', 'Co-brokerage commission split agreement', 'all', 'co-broke', 'pdf', '', '1.0', true, true, 111),
  ('Non-Disclosure Agreement', 'Standard NDA for confidential transactions', 'all', 'nda', 'pdf', '', '1.0', true, true, 112),
  ('Email Templates', 'Standard email templates for client communication', 'all', 'email-templates', 'pdf', '', '1.0', true, false, 113);