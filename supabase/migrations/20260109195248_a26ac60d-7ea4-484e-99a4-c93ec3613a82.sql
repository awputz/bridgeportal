-- Seed marketing templates with starter content
INSERT INTO public.marketing_templates (name, description, category, type, is_featured, is_premium, design_data)
VALUES
  -- Social Media Templates
  ('Instagram Just Listed', 'Eye-catching Instagram post for new listings with property highlights', 'Digital', 'social-post', true, false, 
   '{"platform": "instagram", "hashtags": "#justlisted #realestate #newhome #dreamhome #forsale"}'),
  
  ('Facebook Open House', 'Engaging Facebook post to promote open house events', 'Digital', 'social-post', true, false,
   '{"platform": "facebook", "hashtags": "#openhouse #realestate #househunting"}'),
  
  ('LinkedIn Market Update', 'Professional market update post for LinkedIn network', 'Digital', 'social-post', false, false,
   '{"platform": "linkedin", "hashtags": "#realestate #marketupdate #investing"}'),
  
  ('Instagram Just Sold', 'Celebratory Instagram post for closed deals', 'Digital', 'social-post', true, false,
   '{"platform": "instagram", "hashtags": "#justsold #soldproperty #realestate #closedeal"}'),

  -- Flyer Templates
  ('Just Listed Flyer', 'Professional property flyer for new listings with all key details', 'Print', 'flyer', true, false,
   '{"flyerType": "just-listed"}'),
  
  ('Open House Flyer', 'Inviting open house flyer with date, time, and property features', 'Print', 'flyer', true, false,
   '{"flyerType": "open-house"}'),
  
  ('Price Reduction Flyer', 'Attention-grabbing flyer for price reductions', 'Print', 'flyer', false, false,
   '{"flyerType": "price-reduced"}'),

  -- Email Templates
  ('New Listing Announcement', 'Professional email announcing a new property listing', 'Email', 'email', true, false,
   '{"emailType": "just-listed", "recipientType": "buyers", "callToAction": "schedule-showing"}'),
  
  ('Open House Invitation', 'Warm invitation email for upcoming open house events', 'Email', 'email', true, false,
   '{"emailType": "open-house", "recipientType": "buyers", "callToAction": "attend-open-house"}'),
  
  ('Market Update Newsletter', 'Monthly newsletter with market trends and insights', 'Email', 'email', false, true,
   '{"emailType": "market-update", "recipientType": "past-clients", "callToAction": "contact-agent"}'),

  -- Presentation Templates
  ('Listing Presentation', 'Comprehensive listing presentation for seller meetings', 'Pitch', 'presentation', true, false,
   '{"presentationType": "listing"}'),
  
  ('Buyer Consultation', 'Professional buyer consultation presentation deck', 'Pitch', 'presentation', true, false,
   '{"presentationType": "buyer"}')

ON CONFLICT DO NOTHING;