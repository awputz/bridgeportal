-- Create agent_requests table
CREATE TABLE public.agent_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  request_type TEXT NOT NULL,
  property_address TEXT,
  client_name TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_requests ENABLE ROW LEVEL SECURITY;

-- Agents can create requests
CREATE POLICY "Agents can create requests"
ON public.agent_requests
FOR INSERT
WITH CHECK (is_admin_or_agent(auth.uid()));

-- Agents can view their own requests
CREATE POLICY "Agents can view their requests"
ON public.agent_requests
FOR SELECT
USING (is_admin_or_agent(auth.uid()));

-- Admins can manage all requests
CREATE POLICY "Admins can manage all requests"
ON public.agent_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_agent_requests_updated_at
BEFORE UPDATE ON public.agent_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();