-- Drop the existing check constraint on category
ALTER TABLE public.team_members DROP CONSTRAINT IF EXISTS team_members_category_check;

-- Add new columns if they don't exist
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS license_number text;

-- Clear existing team members
DELETE FROM public.team_members;

-- Insert seed data with all 18 agents
INSERT INTO public.team_members (name, slug, title, email, phone, license_number, instagram_url, linkedin_url, category, bio, display_order, is_active, image_url) VALUES
-- Leadership (1-4)
('Alex W. Putzer', 'alex_w_putzer', 'Co Founder & Managing Partner', 'alex@bridgenyre.com', '9173531916', NULL, NULL, NULL, 'Leadership', 'Vision, brand, hiring, systems, and overall execution across Bridge.', 1, true, 'https://ui-avatars.com/api/?name=Alex+W+Putzer&size=400&background=18181b&color=fff&font-size=0.35'),
('Joshua S. Malekan', 'joshua_s_malekan', 'Co Founder & Principal', 'joshua@bridgenyre.com', '5167614777', NULL, NULL, NULL, 'Leadership', 'Senior leader focused on sourcing, underwriting, and closing investment sales.', 2, true, 'https://ui-avatars.com/api/?name=Joshua+S+Malekan&size=400&background=18181b&color=fff&font-size=0.35'),
('Matthew Simon, ESQ.', 'matthew_simon_esq', 'Chairman, Legal', 'matthew@bridgenyre.com', '9293664522', NULL, NULL, NULL, 'Leadership', 'Provides legal oversight and guidance to the firm.', 3, true, 'https://ui-avatars.com/api/?name=Matthew+Simon&size=400&background=18181b&color=fff&font-size=0.35'),
('Jacob Neiderfer', 'jacob_neiderfer', 'Partner', 'jn@bridgenyre.com', '5165025351', NULL, NULL, NULL, 'Leadership', 'Commercial Partner, focusing on office and retail leasing.', 4, true, 'https://ui-avatars.com/api/?name=Jacob+Neiderfer&size=400&background=18181b&color=fff&font-size=0.35'),

-- Investment Sales (5-12)
('Eric Delafraz', 'eric_delafraz', 'Managing Director / Investment Sales', 'eric@bridgenyre.com', '5164775951', '10401334366', NULL, NULL, 'Investment Sales', 'Head of Investment Sales, focused on sourcing, underwriting, and closing building sales.', 5, true, 'https://ui-avatars.com/api/?name=Eric+Delafraz&size=400&background=18181b&color=fff&font-size=0.35'),
('Roy I. Oskar', 'roy_i_oskar', 'Investment Sales Director', 'roy@bridgenyre.com', '3476931229', '10401314294', NULL, NULL, 'Investment Sales', 'Investment Sales Director focused on deal execution and client coverage.', 6, true, 'https://ui-avatars.com/api/?name=Roy+I+Oskar&size=400&background=18181b&color=fff&font-size=0.35'),
('Brandon Khankhanian', 'brandon_khankhanian', 'Investment Sales Associate', 'brandon@bridgenyre.com', '9177675694', '10401394130', NULL, NULL, 'Investment Sales', 'Supports the Investment Sales team on building acquisitions and dispositions.', 7, true, 'https://ui-avatars.com/api/?name=Brandon+Khankhanian&size=400&background=18181b&color=fff&font-size=0.35'),
('Matt Dowling', 'matt_dowling', 'Senior Investment Sales Associate', 'matt@bridgenyre.com', '5164911492', NULL, NULL, NULL, 'Investment Sales', 'Senior associate focused on value add opportunities and underwriting.', 8, true, 'https://ui-avatars.com/api/?name=Matt+Dowling&size=400&background=18181b&color=fff&font-size=0.35'),
('Emanuel Hakami', 'emanuel_hakami', 'Investment Sales Associate', 'emanuel@bridgenyre.com', '5168159031', '10401377245', NULL, NULL, 'Investment Sales', 'Investment Sales Associate.', 9, true, 'https://ui-avatars.com/api/?name=Emanuel+Hakami&size=400&background=18181b&color=fff&font-size=0.35'),
('Asher Nazar', 'asher_nazar', 'Investment Sales Associate', 'asher@bridgenyre.com', '5163430609', '10401310394', NULL, NULL, 'Investment Sales', 'Investment Sales Associate.', 10, true, 'https://ui-avatars.com/api/?name=Asher+Nazar&size=400&background=18181b&color=fff&font-size=0.35'),
('Quinn Hukee', 'quinn_hukee', 'Investment Sales Associate', 'quinn@bridgenyre.com', '9177434271', NULL, NULL, NULL, 'Investment Sales', 'Investment Sales Associate.', 11, true, 'https://ui-avatars.com/api/?name=Quinn+Hukee&size=400&background=18181b&color=fff&font-size=0.35'),
('Noah Kaplan', 'noah_kaplan', 'Investment Sales Associate', 'noah@bridgenyre.com', '6312582328', '10401392384', NULL, NULL, 'Investment Sales', 'Investment Sales Associate.', 12, true, 'https://ui-avatars.com/api/?name=Noah+Kaplan&size=400&background=18181b&color=fff&font-size=0.35'),

-- Residential (13-14)
('Henny Sherman', 'henny_sherman', 'Residential Associate', 'henny@bridgenyre.com', '9179074060', '10401386648', NULL, NULL, 'Residential', 'Handles Residential leasing and sales across Manhattan, Brooklyn, and Queens.', 13, true, 'https://ui-avatars.com/api/?name=Henny+Sherman&size=400&background=18181b&color=fff&font-size=0.35'),
('Coco Campbell', 'coco_campbell', 'Residential Leasing Associate', 'coco@bridgenyre.com', '9173645829', '10401374322', NULL, NULL, 'Residential', 'Focuses on exclusive rental listings and landlord relationships.', 14, true, 'https://ui-avatars.com/api/?name=Coco+Campbell&size=400&background=18181b&color=fff&font-size=0.35'),

-- Operations (15-16)
('David Nass', 'david_nass', 'Coordinator', 'leasing@bridgenyre.com', NULL, NULL, NULL, NULL, 'Operations', 'Operations and administrative support.', 15, true, 'https://ui-avatars.com/api/?name=David+Nass&size=400&background=18181b&color=fff&font-size=0.35'),
('Arezu Bedar', 'arezu_bedar', 'Coordinator', 'arezu@bridgenyre.com', '5169881565', NULL, NULL, NULL, 'Operations', 'Operations and administrative support.', 16, true, 'https://ui-avatars.com/api/?name=Arezu+Bedar&size=400&background=18181b&color=fff&font-size=0.35'),

-- Marketing (17)
('Manuel Rupert', 'manuel_rupert', 'Marketing Coordinator', 'marketing@bridgenyre.com', NULL, NULL, NULL, NULL, 'Marketing', 'Supports marketing production and digital content.', 17, true, 'https://ui-avatars.com/api/?name=Manuel+Rupert&size=400&background=18181b&color=fff&font-size=0.35'),

-- Advisory (18)
('Evan Nehmadi', 'evan_nehmadi', 'Advisory', 'evan@bridgenyre.com', NULL, '10401347027', NULL, NULL, 'Advisory', 'Supports Bridge Capital Advisory and strategic firm initiatives.', 18, true, 'https://ui-avatars.com/api/?name=Evan+Nehmadi&size=400&background=18181b&color=fff&font-size=0.35');