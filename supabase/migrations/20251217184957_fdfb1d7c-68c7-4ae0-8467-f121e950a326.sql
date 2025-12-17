-- Update the team_members_public view to include email and phone
DROP VIEW IF EXISTS team_members_public;

CREATE VIEW team_members_public AS
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
  phone
FROM team_members 
WHERE is_active = true;