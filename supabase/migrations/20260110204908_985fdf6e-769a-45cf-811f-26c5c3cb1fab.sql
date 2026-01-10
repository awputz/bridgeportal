
-- =============================================
-- ESIGN SUITE: Phase 1 - Database Foundation
-- Step 1: Create all tables first (no cross-table policies)
-- =============================================

-- 1. ESIGN DOCUMENTS: Main document table
CREATE TABLE public.esign_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.agent_templates(id) ON DELETE SET NULL,
  division TEXT CHECK (division IN ('investment-sales', 'commercial-leasing', 'residential', 'marketing')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'in_progress', 'completed', 'voided', 'declined')),
  original_file_url TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  original_file_type TEXT DEFAULT 'application/pdf',
  signed_file_url TEXT,
  total_signers INTEGER DEFAULT 1,
  signed_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  voided_at TIMESTAMPTZ,
  void_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.esign_documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_esign_documents_created_by ON public.esign_documents(created_by);
CREATE INDEX idx_esign_documents_deal_id ON public.esign_documents(deal_id);
CREATE INDEX idx_esign_documents_status ON public.esign_documents(status);
CREATE INDEX idx_esign_documents_division ON public.esign_documents(division);

-- 2. ESIGN RECIPIENTS
CREATE TABLE public.esign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.esign_documents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'signer' CHECK (role IN ('signer', 'cc', 'viewer')),
  signer_type TEXT CHECK (signer_type IN ('agent', 'buyer', 'seller', 'attorney', 'broker', 'other')),
  signing_order INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'viewed', 'signed', 'declined')),
  access_token UUID DEFAULT gen_random_uuid(),
  token_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  decline_reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.esign_recipients ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_esign_recipients_document_id ON public.esign_recipients(document_id);
CREATE INDEX idx_esign_recipients_email ON public.esign_recipients(email);
CREATE INDEX idx_esign_recipients_access_token ON public.esign_recipients(access_token);

-- 3. ESIGN FIELDS
CREATE TABLE public.esign_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.esign_documents(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.esign_recipients(id) ON DELETE CASCADE,
  field_type TEXT NOT NULL CHECK (field_type IN ('signature', 'initials', 'date', 'text', 'checkbox', 'dropdown')),
  label TEXT,
  placeholder TEXT,
  required BOOLEAN DEFAULT true,
  page_number INTEGER NOT NULL DEFAULT 1,
  x_position DECIMAL NOT NULL,
  y_position DECIMAL NOT NULL,
  width DECIMAL NOT NULL DEFAULT 200,
  height DECIMAL NOT NULL DEFAULT 50,
  value TEXT,
  filled_at TIMESTAMPTZ,
  options JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.esign_fields ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_esign_fields_document_id ON public.esign_fields(document_id);
CREATE INDEX idx_esign_fields_recipient_id ON public.esign_fields(recipient_id);

-- 4. ESIGN SIGNATURES
CREATE TABLE public.esign_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL UNIQUE,
  signature_type TEXT NOT NULL CHECK (signature_type IN ('draw', 'type', 'upload')),
  signature_data TEXT NOT NULL,
  font_family TEXT,
  initials_type TEXT CHECK (initials_type IN ('draw', 'type', 'upload')),
  initials_data TEXT,
  initials_font_family TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.esign_signatures ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_esign_signatures_email ON public.esign_signatures(user_email);

-- 5. ESIGN AUDIT LOG
CREATE TABLE public.esign_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.esign_documents(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.esign_recipients(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  action_details JSONB,
  actor_email TEXT,
  actor_name TEXT,
  ip_address INET,
  user_agent TEXT,
  geolocation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.esign_audit_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_esign_audit_document_id ON public.esign_audit_log(document_id);
CREATE INDEX idx_esign_audit_created_at ON public.esign_audit_log(created_at);

-- =============================================
-- Step 2: Now add RLS policies (tables exist)
-- =============================================

-- ESIGN DOCUMENTS POLICIES
CREATE POLICY "esign_docs_select" ON public.esign_documents
  FOR SELECT USING (
    created_by = auth.uid() 
    OR id IN (SELECT document_id FROM public.esign_recipients WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "esign_docs_insert" ON public.esign_documents
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "esign_docs_update" ON public.esign_documents
  FOR UPDATE USING (
    created_by = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "esign_docs_delete" ON public.esign_documents
  FOR DELETE USING (
    created_by = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ESIGN RECIPIENTS POLICIES
CREATE POLICY "esign_recipients_select" ON public.esign_recipients
  FOR SELECT USING (
    document_id IN (SELECT id FROM public.esign_documents WHERE created_by = auth.uid())
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "esign_recipients_insert" ON public.esign_recipients
  FOR INSERT WITH CHECK (
    document_id IN (SELECT id FROM public.esign_documents WHERE created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "esign_recipients_update" ON public.esign_recipients
  FOR UPDATE USING (
    document_id IN (SELECT id FROM public.esign_documents WHERE created_by = auth.uid())
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "esign_recipients_delete" ON public.esign_recipients
  FOR DELETE USING (
    document_id IN (SELECT id FROM public.esign_documents WHERE created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ESIGN FIELDS POLICIES
CREATE POLICY "esign_fields_select" ON public.esign_fields
  FOR SELECT USING (
    document_id IN (SELECT id FROM public.esign_documents WHERE created_by = auth.uid())
    OR recipient_id IN (SELECT id FROM public.esign_recipients WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "esign_fields_insert" ON public.esign_fields
  FOR INSERT WITH CHECK (
    document_id IN (SELECT id FROM public.esign_documents WHERE created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "esign_fields_update" ON public.esign_fields
  FOR UPDATE USING (
    document_id IN (SELECT id FROM public.esign_documents WHERE created_by = auth.uid())
    OR recipient_id IN (SELECT id FROM public.esign_recipients WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "esign_fields_delete" ON public.esign_fields
  FOR DELETE USING (
    document_id IN (SELECT id FROM public.esign_documents WHERE created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ESIGN SIGNATURES POLICIES
CREATE POLICY "esign_signatures_select" ON public.esign_signatures
  FOR SELECT USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "esign_signatures_insert" ON public.esign_signatures
  FOR INSERT WITH CHECK (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "esign_signatures_update" ON public.esign_signatures
  FOR UPDATE USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "esign_signatures_delete" ON public.esign_signatures
  FOR DELETE USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ESIGN AUDIT LOG POLICIES
CREATE POLICY "esign_audit_select" ON public.esign_audit_log
  FOR SELECT USING (
    document_id IN (SELECT id FROM public.esign_documents WHERE created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "esign_audit_insert" ON public.esign_audit_log
  FOR INSERT WITH CHECK (true);

-- =============================================
-- Step 3: Triggers for updated_at
-- =============================================
CREATE TRIGGER update_esign_documents_updated_at
  BEFORE UPDATE ON public.esign_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esign_recipients_updated_at
  BEFORE UPDATE ON public.esign_recipients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esign_fields_updated_at
  BEFORE UPDATE ON public.esign_fields
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esign_signatures_updated_at
  BEFORE UPDATE ON public.esign_signatures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Step 4: Helper function for audit logging
-- =============================================
CREATE OR REPLACE FUNCTION public.log_esign_action(
  p_document_id UUID,
  p_recipient_id UUID,
  p_action TEXT,
  p_action_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_email TEXT;
  v_actor_name TEXT;
  v_log_id UUID;
BEGIN
  SELECT email INTO v_actor_email FROM auth.users WHERE id = auth.uid();
  SELECT full_name INTO v_actor_name FROM public.profiles WHERE id = auth.uid();
  
  INSERT INTO public.esign_audit_log (
    document_id, recipient_id, action, action_details,
    actor_email, actor_name, ip_address, user_agent
  ) VALUES (
    p_document_id, p_recipient_id, p_action, p_action_details,
    v_actor_email, v_actor_name, p_ip_address, p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;
