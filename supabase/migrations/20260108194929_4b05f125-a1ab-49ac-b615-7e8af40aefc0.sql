-- Fix is_hr_admin() to check for 'admin' role instead of non-existent 'hr_admin'
CREATE OR REPLACE FUNCTION public.is_hr_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
    AND role = 'admin'
  )
$$;

-- Fix hr_notifications insert policy to allow users to create their own notifications
DROP POLICY IF EXISTS "Admins can insert notifications" ON hr_notifications;

CREATE POLICY "Users can insert their notifications" 
ON hr_notifications FOR INSERT 
WITH CHECK (auth.uid() = user_id OR is_admin_user(auth.uid()));