-- Phase 1: Create new optimized tables

-- Activity logging for audit trail
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Email notification queue and tracking
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Property analytics and view tracking
CREATE TABLE IF NOT EXISTS public.property_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  view_type TEXT NOT NULL DEFAULT 'page_view',
  session_id TEXT,
  referrer TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Media files library
CREATE TABLE IF NOT EXISTS public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT,
  entity_id UUID,
  alt_text TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Phase 2: Add indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_desc ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_user ON public.inquiries(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON public.inquiries(email);

CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured, created_at DESC) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type) WHERE listing_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);

CREATE INDEX IF NOT EXISTS idx_transactions_created_desc ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_year ON public.transactions(year) WHERE year IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_deal_type ON public.transactions(deal_type);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_desc ON public.activity_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_property_analytics_property ON public.property_analytics(property_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_analytics_user ON public.property_analytics(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_media_files_entity ON public.media_files(entity_type, entity_id) WHERE entity_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON public.media_files(uploaded_by, created_at DESC);

-- Phase 3: Enable RLS on new tables
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Phase 4: Create RLS policies

-- Activity logs: Admins can view all, users can view their own
CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs
FOR SELECT
USING (is_admin_or_agent(auth.uid()));

CREATE POLICY "Users can view their own activity logs"
ON public.activity_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (true);

-- Email notifications: Admins and agents only
CREATE POLICY "Admins and agents can manage email notifications"
ON public.email_notifications
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- Property analytics: Public can insert (tracking), admins can view
CREATE POLICY "Anyone can track property views"
ON public.property_analytics
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins and agents can view analytics"
ON public.property_analytics
FOR SELECT
USING (is_admin_or_agent(auth.uid()));

-- Media files: Public read for public files, admins can manage
CREATE POLICY "Anyone can view public media files"
ON public.media_files
FOR SELECT
USING (bucket_name IN ('property-images', 'team-photos', 'research-pdfs'));

CREATE POLICY "Admins and agents can manage all media files"
ON public.media_files
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- Phase 5: Add triggers for updated_at timestamps
CREATE TRIGGER update_email_notifications_updated_at
BEFORE UPDATE ON public.email_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at
BEFORE UPDATE ON public.media_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Phase 6: Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]),
  ('team-photos', 'team-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]),
  ('research-pdfs', 'research-pdfs', true, 52428800, ARRAY['application/pdf']::text[]),
  ('private-documents', 'private-documents', false, 20971520, NULL)
ON CONFLICT (id) DO NOTHING;

-- Phase 7: Storage RLS policies

-- Property images: Public read, admins write
CREATE POLICY "Anyone can view property images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Admins can upload property images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'property-images' AND is_admin_or_agent(auth.uid()));

CREATE POLICY "Admins can update property images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'property-images' AND is_admin_or_agent(auth.uid()));

CREATE POLICY "Admins can delete property images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'property-images' AND is_admin_or_agent(auth.uid()));

-- Team photos: Public read, admins write
CREATE POLICY "Anyone can view team photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'team-photos');

CREATE POLICY "Admins can manage team photos"
ON storage.objects
FOR ALL
USING (bucket_id = 'team-photos' AND is_admin_or_agent(auth.uid()));

-- Research PDFs: Public read, admins write
CREATE POLICY "Anyone can view research PDFs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'research-pdfs');

CREATE POLICY "Admins can manage research PDFs"
ON storage.objects
FOR ALL
USING (bucket_id = 'research-pdfs' AND is_admin_or_agent(auth.uid()));

-- Private documents: Admins only
CREATE POLICY "Admins can manage private documents"
ON storage.objects
FOR ALL
USING (bucket_id = 'private-documents' AND is_admin_or_agent(auth.uid()));