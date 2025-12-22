-- Create inquiries table for contact form submissions
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  inquiry_type text,
  user_type text,
  property_address text,
  neighborhoods text,
  requirements text,
  budget text,
  timeline text,
  timing text,
  assignment_type text,
  unit_count text,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry (public form)
CREATE POLICY "Anyone can submit inquiries"
ON public.inquiries
FOR INSERT
WITH CHECK (true);

-- Only admins/agents can view inquiries
CREATE POLICY "Admins can view all inquiries"
ON public.inquiries
FOR SELECT
USING (is_admin_or_agent(auth.uid()));

-- Admins can manage inquiries
CREATE POLICY "Admins can manage inquiries"
ON public.inquiries
FOR ALL
USING (is_admin_or_agent(auth.uid()));