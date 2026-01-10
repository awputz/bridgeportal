-- Create private bucket for eSign documents (50MB limit, PDFs and images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'esign-documents',
  'esign-documents',
  false,
  52428800,
  ARRAY['application/pdf', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policy: Users can upload documents to their own folder
CREATE POLICY "Users can upload esign documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'esign-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy: Users can view their own documents or documents they're recipients of
CREATE POLICY "Users can view esign documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'esign-documents'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.esign_recipients er
      JOIN public.esign_documents ed ON ed.id = er.document_id
      WHERE er.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND ed.original_file_url LIKE '%' || name || '%'
    )
  )
);

-- RLS policy: Users can delete their own documents
CREATE POLICY "Users can delete own esign documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'esign-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);