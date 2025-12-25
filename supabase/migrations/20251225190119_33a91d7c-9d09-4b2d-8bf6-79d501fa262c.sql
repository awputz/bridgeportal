-- Create notifications table for agents
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Agents can only view their own notifications
CREATE POLICY "Agents can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (agent_id = auth.uid());

-- Agents can update their own notifications (mark as read)
CREATE POLICY "Agents can update own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (agent_id = auth.uid());

-- Agents can delete their own notifications
CREATE POLICY "Agents can delete own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (agent_id = auth.uid());

-- System can insert notifications (for triggers)
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Enable realtime for instant notification updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create trigger function to notify agent on commission request status change
CREATE OR REPLACE FUNCTION public.notify_agent_on_commission_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger on status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Create notification based on new status
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'commission_approved',
        'Commission Request Approved',
        'Your commission request for ' || NEW.property_address || ' ($' || NEW.commission_amount || ') has been approved!',
        '/portal/my-commission-requests'
      );
    ELSIF NEW.status = 'paid' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'commission_paid',
        'Commission Paid!',
        'Your commission of $' || NEW.commission_amount || ' for ' || NEW.property_address || ' has been paid!',
        '/portal/my-commission-requests'
      );
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'commission_rejected',
        'Commission Request Needs Revision',
        'Your request for ' || NEW.property_address || ' needs revision. Please check admin notes.',
        '/portal/my-commission-requests'
      );
    ELSIF NEW.status = 'under_review' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'commission_under_review',
        'Commission Request Under Review',
        'Your commission request for ' || NEW.property_address || ' is now under review.',
        '/portal/my-commission-requests'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for commission status changes
CREATE TRIGGER trigger_notify_agent_commission_status
AFTER UPDATE ON public.commission_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_agent_on_commission_status();

-- Create trigger function to notify agent on agent request status change
CREATE OR REPLACE FUNCTION public.notify_agent_on_request_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger on status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'completed' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'request_completed',
        'Request Completed',
        'Your ' || NEW.request_type || ' request has been completed!',
        '/portal/requests'
      );
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'request_rejected',
        'Request Could Not Be Fulfilled',
        'Your ' || NEW.request_type || ' request could not be fulfilled. Check notes for details.',
        '/portal/requests'
      );
    ELSIF NEW.status = 'in_progress' THEN
      INSERT INTO public.notifications (agent_id, type, title, message, action_url)
      VALUES (
        NEW.agent_id,
        'request_in_progress',
        'Request In Progress',
        'Your ' || NEW.request_type || ' request is now being worked on.',
        '/portal/requests'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for agent request status changes
CREATE TRIGGER trigger_notify_agent_request_status
AFTER UPDATE ON public.agent_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_agent_on_request_status();