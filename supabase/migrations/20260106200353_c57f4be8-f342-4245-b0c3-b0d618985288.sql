-- Create agent_expenses table
CREATE TABLE public.agent_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core expense info
  expense_date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT NOT NULL,
  
  -- Payment tracking
  payment_method TEXT DEFAULT 'personal_card',
  
  -- Deal association (uses existing crm_deals)
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  billable_to_client BOOLEAN DEFAULT false,
  
  -- Tax information (critical for 1099 contractors)
  is_tax_deductible BOOLEAN DEFAULT true,
  tax_notes TEXT,
  
  -- Receipt management (using Supabase Storage)
  receipt_url TEXT,
  receipt_filename TEXT,
  receipt_uploaded_at TIMESTAMPTZ,
  
  -- Mileage-specific fields
  mileage_from TEXT,
  mileage_to TEXT,
  mileage_distance DECIMAL(10, 2),
  mileage_rate DECIMAL(10, 4) DEFAULT 0.70,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_expenses_agent_date ON public.agent_expenses(agent_id, expense_date DESC);
CREATE INDEX idx_expenses_agent_category ON public.agent_expenses(agent_id, category);
CREATE INDEX idx_expenses_deal ON public.agent_expenses(deal_id) WHERE deal_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.agent_expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "agents_manage_own_expenses" ON public.agent_expenses
  FOR ALL USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "admins_view_all_expenses" ON public.agent_expenses
  FOR SELECT USING (is_admin_or_agent(auth.uid()));

-- Update timestamp trigger
CREATE TRIGGER update_agent_expenses_updated_at
  BEFORE UPDATE ON public.agent_expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create expense_categories reference table
CREATE TABLE public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  subcategories TEXT[],
  is_tax_deductible_default BOOLEAN DEFAULT true,
  irs_category TEXT,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on categories
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_view_active_categories" ON public.expense_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "admins_manage_categories" ON public.expense_categories
  FOR ALL USING (is_admin_or_agent(auth.uid()));

-- Seed expense categories with real estate agent expense types
INSERT INTO public.expense_categories (name, icon, color, description, subcategories, irs_category, display_order) VALUES
  ('Marketing & Advertising', 'Camera', 'bg-purple-500', 'Costs to market yourself and listings', 
   ARRAY['Listing Photography', 'Videography', 'Virtual Tours', 'Print Materials', 'Digital Advertising', 'Direct Mail', 'Website/Domain', 'Business Cards', 'Signage'], 'Advertising', 1),
  ('Transportation & Mileage', 'Car', 'bg-blue-500', 'Vehicle expenses for business use',
   ARRAY['Mileage (Business Driving)', 'Gas', 'Parking', 'Tolls', 'Vehicle Maintenance', 'Auto Insurance (Business)'], 'Car and Truck Expenses', 2),
  ('Client Entertainment & Gifts', 'Coffee', 'bg-pink-500', 'Client entertainment expenses',
   ARRAY['Client Meals (50% Deductible)', 'Coffee Meetings', 'Client Gifts', 'Closing Gifts', 'Open House Refreshments'], 'Meals and Entertainment', 3),
  ('Professional Development', 'BookOpen', 'bg-green-500', 'Education and licensing costs',
   ARRAY['License Renewal', 'Continuing Education', 'Designations (GRI, CRS)', 'Conferences', 'Coaching', 'Association Dues (NAR, Board)'], 'Education', 4),
  ('Office Expenses', 'Building2', 'bg-amber-500', 'Office operation costs',
   ARRAY['Desk Fee/Office Rent', 'Office Supplies', 'Equipment', 'Software Subscriptions', 'Phone (Business)', 'Internet (Business)', 'Postage'], 'Office Expense', 5),
  ('Professional Services', 'Scale', 'bg-red-500', 'Fees paid to professionals',
   ARRAY['Accountant/Bookkeeper', 'Attorney', 'Transaction Coordinator', 'Virtual Assistant', 'Photographer', 'Home Stager'], 'Legal and Professional Services', 6),
  ('Technology & Software', 'Laptop', 'bg-indigo-500', 'Technology tools and subscriptions',
   ARRAY['CRM Software', 'MLS Fees', 'Lead Gen Tools', 'Email Marketing', 'E-Signature', 'Cloud Storage'], 'Office Expense', 7),
  ('Insurance', 'Shield', 'bg-cyan-500', 'Business insurance policies',
   ARRAY['E&O Insurance', 'General Liability', 'Business Insurance'], 'Insurance', 8),
  ('Home Office', 'Home', 'bg-teal-500', 'Home office expenses',
   ARRAY['Home Office Deduction', 'Office Furniture', 'Utilities (Business)'], 'Home Office', 9),
  ('Other Business Expenses', 'Pin', 'bg-gray-500', 'Other legitimate expenses',
   ARRAY['Bank Fees', 'Credit Card Processing', 'Miscellaneous', 'Other'], 'Other Expenses', 10);

-- Create expense-receipts storage bucket (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('expense-receipts', 'expense-receipts', false);

-- Storage RLS policies
CREATE POLICY "agents_upload_own_receipts" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'expense-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "agents_view_own_receipts" ON storage.objects
  FOR SELECT USING (bucket_id = 'expense-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "agents_update_own_receipts" ON storage.objects
  FOR UPDATE USING (bucket_id = 'expense-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "agents_delete_own_receipts" ON storage.objects
  FOR DELETE USING (bucket_id = 'expense-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);