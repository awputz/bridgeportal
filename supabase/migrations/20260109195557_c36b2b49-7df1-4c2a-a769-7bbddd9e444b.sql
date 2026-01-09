-- Agent Brand Profiles table
CREATE TABLE public.agent_brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  title TEXT,
  phone TEXT,
  email TEXT,
  license_number TEXT,
  company_name TEXT,
  office_address TEXT,
  company_phone TEXT,
  instagram_handle TEXT,
  facebook_handle TEXT,
  linkedin_handle TEXT,
  twitter_handle TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#ffffff',
  headshot_asset_id UUID REFERENCES marketing_assets(id) ON DELETE SET NULL,
  logo_asset_id UUID REFERENCES marketing_assets(id) ON DELETE SET NULL,
  bio TEXT,
  tagline TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_id)
);

-- Scheduled Social Posts table
CREATE TABLE public.scheduled_social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES marketing_projects(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'linkedin', 'twitter')),
  content TEXT NOT NULL,
  hashtags TEXT[],
  image_url TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'posted', 'failed', 'cancelled')),
  posted_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_social_posts ENABLE ROW LEVEL SECURITY;

-- Brand Profiles policies
CREATE POLICY "Users can view own brand profile" ON public.agent_brand_profiles
  FOR SELECT USING (auth.uid() = agent_id);
  
CREATE POLICY "Users can insert own brand profile" ON public.agent_brand_profiles
  FOR INSERT WITH CHECK (auth.uid() = agent_id);
  
CREATE POLICY "Users can update own brand profile" ON public.agent_brand_profiles
  FOR UPDATE USING (auth.uid() = agent_id);

-- Scheduled Posts policies  
CREATE POLICY "Users can manage own scheduled posts" ON public.scheduled_social_posts
  FOR ALL USING (auth.uid() = agent_id);

-- Update trigger for brand profiles
CREATE TRIGGER update_agent_brand_profiles_updated_at
  BEFORE UPDATE ON public.agent_brand_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for scheduled posts
CREATE TRIGGER update_scheduled_social_posts_updated_at
  BEFORE UPDATE ON public.scheduled_social_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();