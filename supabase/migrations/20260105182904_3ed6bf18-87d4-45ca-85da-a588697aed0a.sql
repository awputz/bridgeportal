-- Add is_general_inquiry column to client_intake_submissions
ALTER TABLE public.client_intake_submissions 
ADD COLUMN IF NOT EXISTS is_general_inquiry BOOLEAN DEFAULT false;