-- Make commercial-closed-transactions bucket public
UPDATE storage.buckets SET public = true WHERE id = 'commercial-closed-transactions';

-- Add RLS policy for public read access
CREATE POLICY "Public read access for commercial transactions"
ON storage.objects FOR SELECT
USING (bucket_id = 'commercial-closed-transactions');