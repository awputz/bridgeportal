-- Create agent_templates table for storing downloadable documents
CREATE TABLE public.agent_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  division TEXT NOT NULL CHECK (division IN ('investment-sales', 'commercial-leasing', 'residential')),
  file_url TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('pdf', 'docx', 'xlsx', 'doc', 'xls', 'pptx')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create external_tools table for quick action links
CREATE TABLE public.external_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_tools ENABLE ROW LEVEL SECURITY;

-- agent_templates policies
CREATE POLICY "Authenticated users can view active templates" 
ON public.agent_templates 
FOR SELECT 
TO authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage templates" 
ON public.agent_templates 
FOR ALL 
USING (is_admin_or_agent(auth.uid()));

-- external_tools policies
CREATE POLICY "Authenticated users can view active tools" 
ON public.external_tools 
FOR SELECT 
TO authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage tools" 
ON public.external_tools 
FOR ALL 
USING (is_admin_or_agent(auth.uid()));

-- Create updated_at trigger for agent_templates
CREATE TRIGGER update_agent_templates_updated_at
BEFORE UPDATE ON public.agent_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default external tools
INSERT INTO public.external_tools (name, description, url, icon, display_order) VALUES
('Webmail', 'Access your email', 'https://mail.google.com', 'Mail', 1),
('CRM', 'Client relationship management', 'https://crm.bridgenyre.com', 'Users', 2),
('Calendar', 'Schedule and appointments', 'https://calendar.google.com', 'Calendar', 3),
('Drive', 'File storage and sharing', 'https://drive.google.com', 'HardDrive', 4),
('Slack', 'Team communication', 'https://slack.com', 'MessageSquare', 5),
('StreetEasy', 'Property search', 'https://streeteasy.com', 'Search', 6);

-- Insert sample templates for each division
INSERT INTO public.agent_templates (name, description, division, file_url, file_type, display_order) VALUES
-- Investment Sales
('Letter of Intent (LOI)', 'Standard LOI for investment sales transactions', 'investment-sales', '/templates/investment-sales/loi.pdf', 'pdf', 1),
('Exclusive Listing Agreement', 'Exclusive right to sell agreement', 'investment-sales', '/templates/investment-sales/exclusive.pdf', 'pdf', 2),
('Setup Sheet', 'Property setup sheet template', 'investment-sales', '/templates/investment-sales/setup-sheet.xlsx', 'xlsx', 3),
('Offering Memorandum Template', 'OM template for investment properties', 'investment-sales', '/templates/investment-sales/om-template.docx', 'docx', 4),
('Due Diligence Checklist', 'Comprehensive DD checklist', 'investment-sales', '/templates/investment-sales/dd-checklist.pdf', 'pdf', 5),
-- Commercial Leasing
('LOI - Tenant Representation', 'Letter of intent for tenant rep deals', 'commercial-leasing', '/templates/commercial-leasing/loi-tenant.pdf', 'pdf', 1),
('LOI - Landlord Representation', 'Letter of intent for landlord rep deals', 'commercial-leasing', '/templates/commercial-leasing/loi-landlord.pdf', 'pdf', 2),
('Lease Abstract Template', 'Template for lease abstracts', 'commercial-leasing', '/templates/commercial-leasing/lease-abstract.docx', 'docx', 3),
('Tenant Requirements Form', 'Form for capturing tenant needs', 'commercial-leasing', '/templates/commercial-leasing/tenant-requirements.pdf', 'pdf', 4),
('Comp Sheet Template', 'Comparable transactions sheet', 'commercial-leasing', '/templates/commercial-leasing/comp-sheet.xlsx', 'xlsx', 5),
-- Residential
('Exclusive Right to Sell', 'Residential exclusive listing agreement', 'residential', '/templates/residential/exclusive-sell.pdf', 'pdf', 1),
('Buyer Representation Agreement', 'Buyer agency agreement', 'residential', '/templates/residential/buyer-rep.pdf', 'pdf', 2),
('Rental Application', 'Standard rental application form', 'residential', '/templates/residential/rental-app.pdf', 'pdf', 3),
('Move-in/Move-out Checklist', 'Property condition checklist', 'residential', '/templates/residential/move-checklist.pdf', 'pdf', 4),
('CMA Template', 'Comparative market analysis template', 'residential', '/templates/residential/cma-template.xlsx', 'xlsx', 5);