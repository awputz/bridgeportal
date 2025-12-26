-- Drop existing source check constraint and add updated one with google-contacts
ALTER TABLE public.crm_contacts DROP CONSTRAINT IF EXISTS crm_contacts_source_check;

-- Add new constraint that includes google-contacts and google as valid sources
ALTER TABLE public.crm_contacts ADD CONSTRAINT crm_contacts_source_check 
  CHECK (source IS NULL OR source = ANY (ARRAY['referral', 'cold-call', 'website', 'open-house', 'networking', 'repeat-client', 'marketing', 'other', 'google-contacts', 'google', 'import', 'csv']::text[]));