-- Drop RLS policies first, then tables
-- Drop email_notifications policies
DROP POLICY IF EXISTS "Admins and agents can manage email notifications" ON public.email_notifications;
DROP TABLE IF EXISTS public.email_notifications;

-- Drop favorites policies
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP TABLE IF EXISTS public.favorites;

-- Drop inquiries policies
DROP POLICY IF EXISTS "Admins and agents can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins and agents can view all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP TABLE IF EXISTS public.inquiries;

-- Drop media_files policies
DROP POLICY IF EXISTS "Admins and agents can manage all media files" ON public.media_files;
DROP POLICY IF EXISTS "Anyone can view public media files" ON public.media_files;
DROP TABLE IF EXISTS public.media_files;

-- Drop tour_requests policies
DROP POLICY IF EXISTS "Admins and agents can update tour requests" ON public.tour_requests;
DROP POLICY IF EXISTS "Admins and agents can view all tour requests" ON public.tour_requests;
DROP POLICY IF EXISTS "Anyone can create tour requests" ON public.tour_requests;
DROP TABLE IF EXISTS public.tour_requests;

-- Drop activity_logs policies
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.activity_logs;
DROP TABLE IF EXISTS public.activity_logs;

-- Drop property_analytics policies (need to drop FK first)
DROP POLICY IF EXISTS "Admins and agents can view analytics" ON public.property_analytics;
DROP POLICY IF EXISTS "Anyone can track property views" ON public.property_analytics;
DROP TABLE IF EXISTS public.property_analytics;

-- Drop properties policies (transactions has FK to properties, need to handle)
-- First update transactions to remove building_id references
ALTER TABLE IF EXISTS public.transactions DROP CONSTRAINT IF EXISTS transactions_building_id_fkey;
DROP POLICY IF EXISTS "Admins and agents can manage properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can view active properties" ON public.properties;
DROP TABLE IF EXISTS public.properties;

-- Drop research_notes policies
DROP POLICY IF EXISTS "Admins and agents can manage research notes" ON public.research_notes;
DROP POLICY IF EXISTS "Anyone can view research notes" ON public.research_notes;
DROP TABLE IF EXISTS public.research_notes;