-- Sample Deal 1: Brooklyn Multifamily (Investment Sales)
INSERT INTO crm_deals (
  agent_id, property_address, borough, neighborhood, 
  value, gross_sf, property_type, division, deal_type,
  is_off_market, deal_room_visibility, deal_room_notes, 
  last_deal_room_update, is_active
) VALUES (
  '60230f9e-fd76-4fcc-b42a-ff091d496258',
  '419 Lafayette Street',
  'Brooklyn',
  'Clinton Hill',
  3200000,
  8500,
  'multifamily',
  'investment-sales',
  'acquisition',
  true,
  'team',
  'Fully occupied 6-unit building with upside potential. Great cap rate opportunity.',
  NOW() - INTERVAL '2 hours',
  true
);

-- Sample Deal 2: Manhattan Office (Commercial Leasing)
INSERT INTO crm_deals (
  agent_id, property_address, borough, neighborhood,
  value, gross_sf, property_type, division, deal_type,
  is_off_market, deal_room_visibility, deal_room_notes,
  last_deal_room_update, is_active
) VALUES (
  '80f44e9d-8811-4104-9204-452e6c9db2e2',
  '250 Broadway',
  'Manhattan',
  'Financial District',
  5500000,
  12000,
  'office',
  'commercial-leasing',
  'sublease',
  true,
  'team',
  'Class A office with amazing views. Landlord motivated for quick deal.',
  NOW() - INTERVAL '1 day',
  true
);

-- Sample Deal 3: Brooklyn Retail
INSERT INTO crm_deals (
  agent_id, property_address, borough, neighborhood,
  value, gross_sf, property_type, division, deal_type,
  is_off_market, deal_room_visibility, deal_room_notes,
  last_deal_room_update, is_active
) VALUES (
  'a84d63b7-339d-4645-9b37-68f7d357cbae',
  '88 Fulton Street',
  'Brooklyn',
  'DUMBO',
  1800000,
  3500,
  'retail',
  'investment-sales',
  'acquisition',
  true,
  'team',
  'Corner retail with excellent foot traffic. NNN lease in place.',
  NOW() - INTERVAL '2 days',
  true
);

-- Sample Deal 4: Queens Mixed-Use
INSERT INTO crm_deals (
  agent_id, property_address, borough, neighborhood,
  value, gross_sf, property_type, division, deal_type,
  is_off_market, deal_room_visibility, deal_room_notes,
  last_deal_room_update, is_active
) VALUES (
  '8619039b-0323-427f-8b06-c0668a4dbd7c',
  '45-12 Queens Boulevard',
  'Queens',
  'Sunnyside',
  4200000,
  15000,
  'mixed-use',
  'investment-sales',
  'sale',
  true,
  'team',
  'Prime mixed-use property with retail on ground floor and 8 residential units above.',
  NOW() - INTERVAL '3 days',
  true
);

-- Sample Deal 5: Manhattan Industrial
INSERT INTO crm_deals (
  agent_id, property_address, borough, neighborhood,
  value, gross_sf, property_type, division, deal_type,
  is_off_market, deal_room_visibility, deal_room_notes,
  last_deal_room_update, is_active
) VALUES (
  '60230f9e-fd76-4fcc-b42a-ff091d496258',
  '150 West 25th Street',
  'Manhattan',
  'Chelsea',
  8500000,
  22000,
  'industrial',
  'commercial-leasing',
  'lease',
  true,
  'team',
  'Rare industrial/flex space in Chelsea. Can be delivered vacant or with existing tenant.',
  NOW() - INTERVAL '5 days',
  true
);