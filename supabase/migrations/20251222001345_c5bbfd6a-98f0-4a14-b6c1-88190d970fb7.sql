-- Make the residential-closed-transactions bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'residential-closed-transactions';