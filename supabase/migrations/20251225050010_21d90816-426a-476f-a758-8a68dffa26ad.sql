-- Enable realtime for CRM tables
ALTER PUBLICATION supabase_realtime ADD TABLE crm_deals;
ALTER PUBLICATION supabase_realtime ADD TABLE crm_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE crm_activities;