-- Add status tracking columns to inquiries table
ALTER TABLE public.inquiries 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'new',
ADD COLUMN IF NOT EXISTS contacted_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS contacted_by uuid,
ADD COLUMN IF NOT EXISTS follow_up_notes text;

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);