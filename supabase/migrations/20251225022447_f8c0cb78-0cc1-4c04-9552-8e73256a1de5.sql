-- Add category column to external_tools
ALTER TABLE external_tools ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'research';

-- Delete Reonomy, RealtyMX, and duplicate StreetEasy
DELETE FROM external_tools WHERE id IN (
  'a0f4f728-c9f0-402e-81f6-513260d6af60',
  '95b3e872-76d8-412b-8d4f-a31d89bbe09b',
  '80ff3339-a705-49ab-bcbc-0aaa788d1fb9'
);

-- Update existing tools with categories
UPDATE external_tools SET category = 'research' WHERE icon IN ('Database', 'BarChart', 'FileSearch', 'MapPin');
UPDATE external_tools SET category = 'productivity' WHERE icon IN ('Mail', 'Calendar', 'HardDrive', 'MessageSquare');
UPDATE external_tools SET category = 'productivity' WHERE icon = 'Users';

-- Add ZOLA
INSERT INTO external_tools (name, description, url, icon, category, display_order, is_active)
VALUES ('ZOLA', 'NYC Zoning & Land Use Map', 'https://zola.planning.nyc.gov/', 'MapPin', 'research', 4, true);

-- Add DOB NOW
INSERT INTO external_tools (name, description, url, icon, category, display_order, is_active)
VALUES ('DOB NOW', 'Building permits & violations', 'https://a810-dobnow.nyc.gov/publish/Index.html', 'FileSearch', 'research', 5, true);

-- Add HPD Online
INSERT INTO external_tools (name, description, url, icon, category, display_order, is_active)
VALUES ('HPD Online', 'Housing violations lookup', 'https://hpdonline.hpdnyc.org', 'Building2', 'research', 6, true);