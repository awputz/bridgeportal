-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view subscriptions
CREATE POLICY "Admins can view subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (is_admin_or_agent(auth.uid()));

-- Only admins can update/delete subscriptions
CREATE POLICY "Admins can manage subscriptions" 
ON public.newsletter_subscriptions 
FOR ALL 
USING (is_admin_or_agent(auth.uid()));