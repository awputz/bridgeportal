-- Make investmentsales-closed-transactions-photos bucket public
UPDATE storage.buckets SET public = true WHERE id = 'investmentsales-closed-transactions-photos';

-- Add RLS policy for public read access
CREATE POLICY "Public read access for investment sales transactions photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'investmentsales-closed-transactions-photos');