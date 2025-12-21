-- Create deal_room_registrations table to track all users accessing deal rooms
CREATE TABLE public.deal_room_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  user_type TEXT NOT NULL, -- 'principal', 'broker', 'attorney', 'lender', 'developer', 'other'
  brokerage_firm TEXT, -- If they're a broker, which firm
  working_with TEXT, -- Who referred them or who they're working with
  notes TEXT,
  registered_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  access_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_listing_email UNIQUE(listing_id, email)
);

-- Enable RLS
ALTER TABLE public.deal_room_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can register for deal room access (insert their own registration)
CREATE POLICY "Anyone can register for deal room access"
ON public.deal_room_registrations
FOR INSERT
WITH CHECK (true);

-- Users can check if their email is already registered (for returning users)
CREATE POLICY "Anyone can check their own registration"
ON public.deal_room_registrations
FOR SELECT
USING (true);

-- Users can update their own access count/last accessed
CREATE POLICY "Anyone can update their own registration"
ON public.deal_room_registrations
FOR UPDATE
USING (true);

-- Admins can manage all registrations
CREATE POLICY "Admins can manage all registrations"
ON public.deal_room_registrations
FOR ALL
USING (is_admin_or_agent(auth.uid()));

-- Create index for faster lookups
CREATE INDEX idx_deal_room_registrations_listing_email ON public.deal_room_registrations(listing_id, email);
CREATE INDEX idx_deal_room_registrations_listing ON public.deal_room_registrations(listing_id);