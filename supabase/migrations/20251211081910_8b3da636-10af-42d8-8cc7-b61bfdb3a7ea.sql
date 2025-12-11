-- Add website_url column to bridge_buildings
ALTER TABLE public.bridge_buildings ADD COLUMN IF NOT EXISTS website_url text;

-- Update all 22 buildings with descriptions and website URLs
UPDATE public.bridge_buildings SET 
  description = 'Boutique Lower East Side living with just 5 exclusive units. Located in the heart of the neighborhood''s vibrant dining and nightlife scene.',
  website_url = NULL
WHERE address = '125 Rivington Street';

UPDATE public.bridge_buildings SET 
  description = 'Prestigious Tribeca address featuring 6 luxury residences. Experience the best of downtown Manhattan with world-class restaurants, galleries, and the Hudson River waterfront steps away.',
  website_url = NULL
WHERE address = '90 Chambers Street';

UPDATE public.bridge_buildings SET 
  description = 'Premier NoMad address featuring 47 thoughtfully designed residences. Steps from Madison Square Park, this full-service building offers modern amenities in one of Manhattan''s most dynamic neighborhoods.',
  website_url = 'https://7east30.com'
WHERE address = '7 East 30th Street';

UPDATE public.bridge_buildings SET 
  description = 'Classic West Harlem brownstone with 15 charming units. Tree-lined streets and proximity to Central Park and Columbia University make this an ideal uptown residence.',
  website_url = NULL
WHERE address = '309 West 111th Street';

UPDATE public.bridge_buildings SET 
  description = 'Spacious West Harlem living with 35 well-appointed units. Enjoy easy access to Morningside Park and the vibrant restaurant scene of Frederick Douglass Boulevard.',
  website_url = NULL
WHERE address = '515 West 111th Street';

UPDATE public.bridge_buildings SET 
  description = 'Hamilton Heights gem featuring 36 residences in a beautifully maintained pre-war building. Historic architecture meets modern convenience in this thriving uptown neighborhood.',
  website_url = NULL
WHERE address = '545 West 148th Street';

UPDATE public.bridge_buildings SET 
  description = 'East Harlem landmark with 23 units overlooking Central Park. Experience authentic New York living with stunning park views and easy subway access.',
  website_url = NULL
WHERE address = '1469 Fifth Avenue';

UPDATE public.bridge_buildings SET 
  description = 'Queens living at its finest with 8 intimate units. This Rego Park building offers spacious layouts and excellent transit connections to Manhattan.',
  website_url = NULL
WHERE address = '64-64 Wetherole Street';

UPDATE public.bridge_buildings SET 
  description = 'Upper East Side elegance with 16 meticulously maintained residences. Classic pre-war details, doorman service, and steps from Museum Mile and Central Park.',
  website_url = NULL
WHERE address = '228 E 84th Street';

UPDATE public.bridge_buildings SET 
  description = 'Intimate Upper East Side boutique building with 5 exclusive units. Prime Lenox Hill location near world-renowned hospitals, fine dining, and Madison Avenue shopping.',
  website_url = NULL
WHERE address = '175 East 73rd Street';

UPDATE public.bridge_buildings SET 
  description = 'Hell''s Kitchen hotspot featuring 20 modern residences. Steps from Times Square, Hudson Yards, and the best of Midtown West entertainment and dining.',
  website_url = NULL
WHERE address = '503 W 47th Street';

UPDATE public.bridge_buildings SET 
  description = 'West Harlem cornerstone with 30 spacious units on historic St. Nicholas Avenue. Rich cultural heritage meets contemporary urban living.',
  website_url = NULL
WHERE address = '656 St. Nicholas Avenue';

UPDATE public.bridge_buildings SET 
  description = 'Modern West Harlem living with 39 residences on Frederick Douglass Boulevard. Part of the neighborhood''s exciting renaissance with new restaurants and shops.',
  website_url = NULL
WHERE address = '2445 Frederick Douglass Blvd';

UPDATE public.bridge_buildings SET 
  description = 'Charming West Harlem brownstone with 12 cozy units. Tree-lined block offers a peaceful retreat while remaining connected to Manhattan''s energy.',
  website_url = NULL
WHERE address = '271 West 119th Street';

UPDATE public.bridge_buildings SET 
  description = 'Hamilton Heights beauty with 24 well-designed units. Historic Sugar Hill location with stunning architecture and strong community character.',
  website_url = NULL
WHERE address = '514 West 146th Street';

UPDATE public.bridge_buildings SET 
  description = 'Sister building on West 146th with 18 comfortable residences. Hamilton Heights charm with modern updates and convenient subway access.',
  website_url = NULL
WHERE address = '506 West 146th Street';

UPDATE public.bridge_buildings SET 
  description = 'Washington Heights gem featuring 25 spacious units. Fort Washington Avenue proximity means easy access to Fort Tryon Park and The Cloisters.',
  website_url = NULL
WHERE address = '524 West 159th Street';

UPDATE public.bridge_buildings SET 
  description = 'West Harlem landmark with 28 residences on historic Amsterdam Avenue. Columbia University nearby makes this ideal for academics and professionals.',
  website_url = NULL
WHERE address = '1467 Amsterdam Ave';

UPDATE public.bridge_buildings SET 
  description = 'Central Harlem location with 15 units on West 133rd Street. Part of the neighborhood''s vibrant cultural district with easy access to all of Manhattan.',
  website_url = NULL
WHERE address = '496 West 133rd Street';

UPDATE public.bridge_buildings SET 
  description = 'Upper East Side convenience with 7 units on First Avenue. Yorkville location offers excellent value with neighborhood charm and easy subway access.',
  website_url = NULL
WHERE address = '1299 First Avenue';

UPDATE public.bridge_buildings SET 
  description = 'NoMad''s best address with 7 boutique residences on Sixth Avenue. Premium location near the Flatiron District, Madison Square Park, and endless dining options.',
  website_url = NULL
WHERE address = '832 6th Avenue';

UPDATE public.bridge_buildings SET 
  description = 'Prime NoMad location with 22 modern units. Steps from Korea Town, Herald Square, and the best of Midtown Manhattan. Ideal for young professionals.',
  website_url = NULL
WHERE address = '44-55 West 28th Street';