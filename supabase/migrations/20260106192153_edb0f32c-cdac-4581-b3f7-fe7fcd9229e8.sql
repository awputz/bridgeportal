-- Allow anonymous users to view agent/admin roles for intake form
CREATE POLICY "Public can view agent and admin roles for intake"
  ON public.user_roles
  FOR SELECT
  TO public
  USING (role IN ('agent', 'admin'));

-- Create function to notify agent on new intake submission
CREATE OR REPLACE FUNCTION public.notify_intake_submission()
RETURNS TRIGGER AS $$
DECLARE
  agent_email TEXT;
  agent_name TEXT;
  supabase_url TEXT;
BEGIN
  -- Get agent info
  SELECT email, full_name INTO agent_email, agent_name
  FROM public.profiles WHERE id = NEW.agent_id;
  
  -- Only notify if we have an agent email and it's not a general inquiry
  IF agent_email IS NOT NULL AND NEW.is_general_inquiry IS NOT TRUE THEN
    supabase_url := current_setting('app.settings.supabase_url', true);
    
    -- Log the notification attempt
    RAISE LOG 'Notifying agent % (%) about new intake submission from %', 
      agent_name, agent_email, NEW.client_name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for intake submission notifications
DROP TRIGGER IF EXISTS intake_submission_notify_trigger ON public.client_intake_submissions;
CREATE TRIGGER intake_submission_notify_trigger
  AFTER INSERT ON public.client_intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_intake_submission();