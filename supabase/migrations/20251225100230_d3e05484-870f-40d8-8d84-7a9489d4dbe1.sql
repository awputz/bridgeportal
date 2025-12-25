-- Create email_attachments table for tracking email-CRM links
CREATE TABLE public.email_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_thread_id UUID REFERENCES public.email_threads(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  attached_by UUID NOT NULL,
  attached_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Agents can manage their own email attachments"
ON public.email_attachments
FOR ALL
USING (attached_by = auth.uid());

-- Add index for faster lookups
CREATE INDEX idx_email_attachments_email_thread ON public.email_attachments(email_thread_id);
CREATE INDEX idx_email_attachments_deal ON public.email_attachments(deal_id);
CREATE INDEX idx_email_attachments_contact ON public.email_attachments(contact_id);