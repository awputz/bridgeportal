-- Create storage bucket for building photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('building-photos', 'building-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Anyone can view building photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'building-photos');

-- Create policy for admin/agent upload
CREATE POLICY "Admins can upload building photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'building-photos' 
  AND is_admin_or_agent(auth.uid())
);

-- Create policy for admin/agent update
CREATE POLICY "Admins can update building photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'building-photos' 
  AND is_admin_or_agent(auth.uid())
);

-- Create policy for admin/agent delete
CREATE POLICY "Admins can delete building photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'building-photos' 
  AND is_admin_or_agent(auth.uid())
);