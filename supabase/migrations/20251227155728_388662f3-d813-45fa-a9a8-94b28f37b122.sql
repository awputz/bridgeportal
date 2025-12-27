-- =============================================
-- CRM INSTITUTIONAL EXPANSION MIGRATION
-- =============================================

-- ======================
-- EXPAND crm_deals TABLE
-- ======================

-- Investment Sales specific fields
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS cap_rate numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS noi numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS building_class text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS unit_count integer;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS year_built integer;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS gross_sf integer;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS asking_price numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS offer_price numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS price_per_unit numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS price_per_sf numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS is_1031_exchange boolean DEFAULT false;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS financing_type text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS lender_name text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS loan_amount numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS due_diligence_deadline date;

-- Commercial Leasing specific fields  
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS tenant_legal_name text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS asking_rent_psf numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS negotiated_rent_psf numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS lease_type text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS lease_term_months integer;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS commencement_date date;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS expiration_date date;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS free_rent_months integer;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS escalation_rate numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS ti_allowance_psf numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS security_deposit_months integer;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS landlord_broker text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS use_clause text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS space_type text;

-- Residential specific fields
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS bedrooms integer;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS bathrooms numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS is_rental boolean DEFAULT false;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS listing_price numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS monthly_rent numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS lease_length_months integer;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS move_in_date date;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS pets_allowed boolean DEFAULT true;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS guarantor_required boolean DEFAULT false;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS co_broke_percent numeric;

-- Common enhanced fields
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS borough text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS neighborhood text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS latitude numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS longitude numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS co_broker_id uuid;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS co_broker_name text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS co_broker_split numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS referral_source text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS property_type text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS zoning text;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS lot_size numeric;
ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS last_activity_date timestamp with time zone;

-- ======================
-- EXPAND crm_contacts TABLE
-- ======================

-- Professional fields
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS secondary_email text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS secondary_phone text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS assistant_name text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS assistant_email text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS assistant_phone text;

-- Relationship fields
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS birthday date;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS last_contact_date timestamp with time zone;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS preferred_contact_method text DEFAULT 'email';
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS do_not_contact boolean DEFAULT false;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS relationship_score integer DEFAULT 0;

-- Business fields
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS company_website text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS portfolio_size numeric;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS investor_profile text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS ownership_entities text[];
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS preferred_asset_types text[];
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS target_markets text[];
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS investment_criteria jsonb;

-- Address standardization fields
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS street_address text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS country text DEFAULT 'USA';
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS latitude numeric;
ALTER TABLE public.crm_contacts ADD COLUMN IF NOT EXISTS longitude numeric;

-- ======================
-- CREATE SAVED FILTERS TABLE
-- ======================

CREATE TABLE IF NOT EXISTS public.crm_saved_filters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  name text NOT NULL,
  division text NOT NULL,
  filter_config jsonb NOT NULL DEFAULT '{}',
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.crm_saved_filters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can manage their own filters"
  ON public.crm_saved_filters FOR ALL
  USING (agent_id = auth.uid());

-- ======================
-- CREATE REFERRALS TABLE
-- ======================

CREATE TABLE IF NOT EXISTS public.crm_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referring_agent_id uuid NOT NULL,
  receiving_agent_id uuid,
  deal_id uuid REFERENCES public.crm_deals(id),
  contact_id uuid REFERENCES public.crm_contacts(id),
  from_division text NOT NULL,
  to_division text NOT NULL,
  referral_fee_percent numeric,
  referral_fee_amount numeric,
  status text DEFAULT 'pending',
  notes text,
  accepted_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.crm_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their referrals"
  ON public.crm_referrals FOR SELECT
  USING (referring_agent_id = auth.uid() OR receiving_agent_id = auth.uid());

CREATE POLICY "Agents can create referrals"
  ON public.crm_referrals FOR INSERT
  WITH CHECK (referring_agent_id = auth.uid());

CREATE POLICY "Agents can update referrals they're involved in"
  ON public.crm_referrals FOR UPDATE
  USING (referring_agent_id = auth.uid() OR receiving_agent_id = auth.uid());

-- ======================
-- ADD INDEXES FOR PERFORMANCE
-- ======================

CREATE INDEX IF NOT EXISTS idx_crm_deals_division ON public.crm_deals(division);
CREATE INDEX IF NOT EXISTS idx_crm_deals_property_type ON public.crm_deals(property_type);
CREATE INDEX IF NOT EXISTS idx_crm_deals_cap_rate ON public.crm_deals(cap_rate);
CREATE INDEX IF NOT EXISTS idx_crm_deals_value ON public.crm_deals(value);
CREATE INDEX IF NOT EXISTS idx_crm_deals_expected_close ON public.crm_deals(expected_close);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_last_contact ON public.crm_contacts(last_contact_date);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_relationship_score ON public.crm_contacts(relationship_score);
CREATE INDEX IF NOT EXISTS idx_crm_saved_filters_agent ON public.crm_saved_filters(agent_id);
CREATE INDEX IF NOT EXISTS idx_crm_referrals_agents ON public.crm_referrals(referring_agent_id, receiving_agent_id);

-- ======================
-- ENABLE REALTIME FOR NEW TABLES
-- ======================

ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_saved_filters;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_referrals;