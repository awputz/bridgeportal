-- Update handle_new_user function to capture Google profile data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, user_type)
  VALUES (
    new.id, 
    new.email,
    COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'phone',
    'agent'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(
      EXCLUDED.full_name,
      profiles.full_name,
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    email = COALESCE(EXCLUDED.email, profiles.email),
    updated_at = now();
  RETURN new;
END;
$$;

-- Add avatar_url column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Update handle_new_user function again with avatar_url support
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, user_type, avatar_url)
  VALUES (
    new.id, 
    new.email,
    COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'phone',
    'agent',
    COALESCE(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      profiles.full_name
    ),
    email = COALESCE(new.email, profiles.email),
    avatar_url = COALESCE(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture',
      profiles.avatar_url
    ),
    updated_at = now();
  RETURN new;
END;
$$;