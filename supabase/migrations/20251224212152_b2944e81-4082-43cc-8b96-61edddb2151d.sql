-- Update team_members_public view to include license_number
CREATE OR REPLACE VIEW team_members_public AS
SELECT 
  id,
  name,
  title,
  bio,
  image_url,
  category,
  display_order,
  slug,
  linkedin_url,
  instagram_url,
  email,
  phone,
  license_number
FROM team_members
WHERE is_active = true;