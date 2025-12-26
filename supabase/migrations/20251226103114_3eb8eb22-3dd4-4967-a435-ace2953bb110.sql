-- Insert/Update profiles for existing investors with their names and avatar URLs
-- Using 'agent' as user_type since the constraint doesn't allow 'investor'
-- The actual investor role is tracked in user_roles table

INSERT INTO public.profiles (id, email, full_name, avatar_url, user_type)
VALUES 
  ('96050073-2ffd-4cd3-aa53-304ef7aeddc6', 'jason@hudsonpointgroup.com', 'Jason Shottenfeld', '/team-photos/jason-shottenfeld.webp', 'agent'),
  ('2b817c8d-a954-4025-88f6-261bd1862772', 'daniel@hudsonpointgroup.com', 'Daniel Levitin', '/team-photos/daniel-levitin.webp', 'agent'),
  ('0aa71f27-c8ba-43ef-b9c9-e4b106cfc230', 'ms@hudsonpointgroup.com', 'Matt Sherr', '/team-photos/matt-sherr.webp', 'agent'),
  ('5bdda88a-50da-41ad-a494-679da7aecb28', 'matt@hudsonpointgroup.com', 'Matthew Pazzaglini', '/team-photos/matthew-pazzaglini.webp', 'agent')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = now();