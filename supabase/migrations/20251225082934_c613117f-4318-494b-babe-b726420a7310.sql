-- Create commission_requests table for agent payment requests
CREATE TABLE public.commission_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  closing_date date NOT NULL,
  deal_type text NOT NULL CHECK (deal_type IN ('sale', 'lease')),
  property_address text NOT NULL,
  commission_amount numeric NOT NULL,
  invoice_url text,
  w9_url text,
  contract_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'paid', 'rejected')),
  notes text,
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.commission_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Agents can view their own commission requests"
ON public.commission_requests
FOR SELECT
USING (auth.uid() = agent_id OR is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can create their own commission requests"
ON public.commission_requests
FOR INSERT
WITH CHECK (auth.uid() = agent_id AND is_admin_or_agent(auth.uid()));

CREATE POLICY "Agents can update their own pending requests"
ON public.commission_requests
FOR UPDATE
USING (
  (auth.uid() = agent_id AND status = 'pending') 
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete commission requests"
ON public.commission_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create updated_at trigger
CREATE TRIGGER update_commission_requests_updated_at
BEFORE UPDATE ON public.commission_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create admin_notifications table
CREATE TABLE public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text,
  action_url text,
  entity_id uuid,
  is_read boolean NOT NULL DEFAULT false,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_notifications (admins only)
CREATE POLICY "Admins can view all notifications"
ON public.admin_notifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update notifications"
ON public.admin_notifications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete notifications"
ON public.admin_notifications
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert notifications"
ON public.admin_notifications
FOR INSERT
WITH CHECK (true);

-- Create function to auto-create admin notification on commission request
CREATE OR REPLACE FUNCTION public.notify_admin_on_commission_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  agent_name text;
BEGIN
  -- Get agent name from team_members
  SELECT name INTO agent_name
  FROM public.team_members
  WHERE email = (SELECT email FROM auth.users WHERE id = NEW.agent_id)
  LIMIT 1;
  
  -- If no team member found, use email
  IF agent_name IS NULL THEN
    SELECT email INTO agent_name FROM auth.users WHERE id = NEW.agent_id;
  END IF;

  -- Insert admin notification
  INSERT INTO public.admin_notifications (
    type,
    title,
    message,
    action_url,
    entity_id,
    priority
  ) VALUES (
    'commission_request',
    'New Commission Request',
    agent_name || ' submitted a commission request for ' || NEW.property_address || ' ($' || NEW.commission_amount || ')',
    '/admin/commission-requests',
    NEW.id,
    'high'
  );

  RETURN NEW;
END;
$$;

-- Create trigger to fire on new commission request
CREATE TRIGGER on_commission_request_created
AFTER INSERT ON public.commission_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_on_commission_request();