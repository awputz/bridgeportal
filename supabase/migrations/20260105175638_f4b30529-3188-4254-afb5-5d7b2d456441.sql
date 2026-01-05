-- Add new fields to crm_deals table for division-specific tracking
ALTER TABLE public.crm_deals 
ADD COLUMN IF NOT EXISTS property_condition TEXT,
ADD COLUMN IF NOT EXISTS ideal_close_date DATE,
ADD COLUMN IF NOT EXISTS tenant_business_type TEXT,
ADD COLUMN IF NOT EXISTS move_in_urgency TEXT,
ADD COLUMN IF NOT EXISTS deal_category TEXT,
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS is_lost BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS lost_reason TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.crm_deals.property_condition IS 'Investment Sales: distressed, value-add, core, core-plus, opportunistic';
COMMENT ON COLUMN public.crm_deals.ideal_close_date IS 'Target close date for the deal';
COMMENT ON COLUMN public.crm_deals.tenant_business_type IS 'Commercial: Type of business (Pizza Shop, Martial Arts, etc.)';
COMMENT ON COLUMN public.crm_deals.move_in_urgency IS 'Commercial: ASAP, Flexible, 30 Days, 60 Days, 90+ Days';
COMMENT ON COLUMN public.crm_deals.deal_category IS 'Residential: rental or sale';
COMMENT ON COLUMN public.crm_deals.due_date IS 'Next action/follow-up due date';
COMMENT ON COLUMN public.crm_deals.is_lost IS 'Whether deal was lost';
COMMENT ON COLUMN public.crm_deals.lost_reason IS 'Reason deal was lost';

-- Update Investment Sales stages to match workflow
UPDATE public.crm_deal_stages SET name = 'Lead', display_order = 1 WHERE division = 'investment-sales' AND name = 'Lead';
UPDATE public.crm_deal_stages SET name = 'Sent Options', display_order = 2 WHERE division = 'investment-sales' AND name = 'Pitch';
UPDATE public.crm_deal_stages SET name = 'Offer Submitted', display_order = 3 WHERE division = 'investment-sales' AND name = 'Listing';
UPDATE public.crm_deal_stages SET name = 'Negotiations', display_order = 4 WHERE division = 'investment-sales' AND name = 'Marketing';
UPDATE public.crm_deal_stages SET name = 'In Contract', display_order = 5 WHERE division = 'investment-sales' AND name = 'Offers';
UPDATE public.crm_deal_stages SET name = 'Closed', display_order = 6 WHERE division = 'investment-sales' AND name = 'Contract';
UPDATE public.crm_deal_stages SET name = 'Paid', display_order = 7 WHERE division = 'investment-sales' AND name = 'Due Diligence';
DELETE FROM public.crm_deal_stages WHERE division = 'investment-sales' AND name = 'Closing';

-- Update Commercial Leasing stages to match workflow
UPDATE public.crm_deal_stages SET name = 'Lead', display_order = 1 WHERE division = 'commercial-leasing' AND name = 'Inquiry';
UPDATE public.crm_deal_stages SET name = 'Follow-Up', display_order = 2 WHERE division = 'commercial-leasing' AND name = 'Requirements';
UPDATE public.crm_deal_stages SET name = 'Searching', display_order = 3 WHERE division = 'commercial-leasing' AND name = 'Space Tour';
UPDATE public.crm_deal_stages SET name = 'Toured', display_order = 4 WHERE division = 'commercial-leasing' AND name = 'Proposal';
UPDATE public.crm_deal_stages SET name = 'LOI Sent / Negotiation', display_order = 5 WHERE division = 'commercial-leasing' AND name = 'Negotiation';
UPDATE public.crm_deal_stages SET name = 'Lease Out', display_order = 6 WHERE division = 'commercial-leasing' AND name = 'LOI';
UPDATE public.crm_deal_stages SET name = 'Closed', display_order = 7 WHERE division = 'commercial-leasing' AND name = 'Lease Execution';

-- Insert new Commercial Leasing stages
INSERT INTO public.crm_deal_stages (division, name, display_order, color, is_active)
VALUES 
  ('commercial-leasing', 'Paid', 8, '#10b981', true),
  ('commercial-leasing', 'Future Potential', 9, '#6b7280', true)
ON CONFLICT DO NOTHING;

-- Update Residential stages to match workflow
UPDATE public.crm_deal_stages SET name = 'Lead', display_order = 1 WHERE division = 'residential' AND name = 'Inquiry';
UPDATE public.crm_deal_stages SET name = 'Coming Up', display_order = 2 WHERE division = 'residential' AND name = 'Showing';
UPDATE public.crm_deal_stages SET name = 'Searching', display_order = 3 WHERE division = 'residential' AND name = 'Application';
UPDATE public.crm_deal_stages SET name = 'Toured', display_order = 4 WHERE division = 'residential' AND name = 'Negotiation';
UPDATE public.crm_deal_stages SET name = 'Application In', display_order = 5 WHERE division = 'residential' AND name = 'Contract';
UPDATE public.crm_deal_stages SET name = 'In Contract', display_order = 6 WHERE division = 'residential' AND name = 'Closing';

-- Insert new Residential stages
INSERT INTO public.crm_deal_stages (division, name, display_order, color, is_active)
VALUES 
  ('residential', 'Closed', 7, '#10b981', true),
  ('residential', 'Paid', 8, '#10b981', true),
  ('residential', 'Future Leads', 9, '#6b7280', true),
  ('residential', 'Lost', 10, '#ef4444', true)
ON CONFLICT DO NOTHING;