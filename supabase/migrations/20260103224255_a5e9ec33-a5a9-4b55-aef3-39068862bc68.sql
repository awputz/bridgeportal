-- Create exclusive_submissions table for listing intake
CREATE TABLE public.exclusive_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  division TEXT NOT NULL CHECK (division IN ('residential', 'investment-sales', 'commercial-leasing')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'under_review', 'approved', 'needs_revision', 'rejected', 'live')),
  
  -- Property Address (from AddressAutocomplete)
  property_address TEXT NOT NULL,
  unit_number TEXT,
  neighborhood TEXT,
  borough TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  
  -- Owner/Landlord Details
  owner_name TEXT NOT NULL,
  owner_email TEXT,
  owner_phone TEXT,
  owner_company TEXT,
  
  -- Division-specific data stored as JSONB
  listing_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Documents
  exclusive_contract_url TEXT, -- REQUIRED before submission
  additional_documents JSONB DEFAULT '[]'::jsonb, -- Array of {name, url, type}
  
  -- Flags
  is_off_market BOOLEAN DEFAULT false,
  is_pocket_listing BOOLEAN DEFAULT false,
  
  -- Admin Review
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- CRM Integration
  converted_deal_id UUID REFERENCES crm_deals(id),
  google_calendar_event_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for agent lookups
CREATE INDEX idx_exclusive_submissions_agent ON public.exclusive_submissions(agent_id);
CREATE INDEX idx_exclusive_submissions_status ON public.exclusive_submissions(status);
CREATE INDEX idx_exclusive_submissions_division ON public.exclusive_submissions(division);

-- Enable RLS
ALTER TABLE public.exclusive_submissions ENABLE ROW LEVEL SECURITY;

-- Agents can view their own submissions
CREATE POLICY "Agents can view their own submissions"
ON public.exclusive_submissions
FOR SELECT
USING (agent_id = auth.uid() OR is_admin_or_agent(auth.uid()));

-- Agents can create their own submissions
CREATE POLICY "Agents can create submissions"
ON public.exclusive_submissions
FOR INSERT
WITH CHECK (agent_id = auth.uid() AND is_admin_or_agent(auth.uid()));

-- Agents can update their own draft/needs_revision submissions
CREATE POLICY "Agents can update own submissions"
ON public.exclusive_submissions
FOR UPDATE
USING (
  (agent_id = auth.uid() AND status IN ('draft', 'needs_revision'))
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can delete
CREATE POLICY "Admins can delete submissions"
ON public.exclusive_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_exclusive_submissions_updated_at
BEFORE UPDATE ON public.exclusive_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.exclusive_submissions;

-- Create storage bucket for exclusive documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('exclusive-documents', 'exclusive-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for exclusive-documents bucket
CREATE POLICY "Agents can upload their own exclusive documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'exclusive-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Agents can view their own exclusive documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'exclusive-documents' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR is_admin_or_agent(auth.uid())
  )
);

CREATE POLICY "Agents can update their own exclusive documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'exclusive-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Agents can delete their own exclusive documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'exclusive-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create admin notification trigger for new submissions
CREATE OR REPLACE FUNCTION public.notify_admin_on_exclusive_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  agent_name text;
  division_label text;
BEGIN
  -- Only trigger when status changes to pending_review
  IF NEW.status = 'pending_review' AND (OLD.status IS NULL OR OLD.status = 'draft') THEN
    -- Get agent name
    SELECT COALESCE(full_name, email) INTO agent_name
    FROM public.profiles
    WHERE id = NEW.agent_id
    LIMIT 1;
    
    -- Format division label
    division_label := CASE NEW.division
      WHEN 'residential' THEN 'Residential'
      WHEN 'investment-sales' THEN 'Investment Sales'
      WHEN 'commercial-leasing' THEN 'Commercial Leasing'
      ELSE NEW.division
    END;

    -- Insert admin notification
    INSERT INTO public.admin_notifications (
      type,
      title,
      message,
      action_url,
      entity_id,
      priority
    ) VALUES (
      'exclusive_submission',
      'New Exclusive Submission',
      COALESCE(agent_name, 'An agent') || ' submitted a ' || division_label || ' exclusive at ' || NEW.property_address,
      '/admin/exclusive-submissions',
      NEW.id,
      'high'
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_exclusive_submission
AFTER INSERT OR UPDATE ON public.exclusive_submissions
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_on_exclusive_submission();

-- Create agent notification trigger for status changes
CREATE OR REPLACE FUNCTION public.notify_agent_on_exclusive_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger on status changes (not draft)
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status != 'draft' THEN
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'exclusive_approved',
        'Exclusive Approved!',
        'Your exclusive at ' || NEW.property_address || ' has been approved and is now live.',
        '/portal/my-exclusives'
      );
    ELSIF NEW.status = 'needs_revision' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'exclusive_revision',
        'Exclusive Needs Revision',
        'Your exclusive at ' || NEW.property_address || ' needs revision. Check admin notes.',
        '/portal/exclusives/' || NEW.id || '/edit'
      );
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'exclusive_rejected',
        'Exclusive Rejected',
        'Your exclusive at ' || NEW.property_address || ' was rejected. See notes for details.',
        '/portal/my-exclusives'
      );
    ELSIF NEW.status = 'under_review' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'exclusive_under_review',
        'Exclusive Under Review',
        'Your exclusive at ' || NEW.property_address || ' is being reviewed.',
        '/portal/my-exclusives'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_exclusive_status_change
AFTER UPDATE ON public.exclusive_submissions
FOR EACH ROW
EXECUTE FUNCTION public.notify_agent_on_exclusive_status();