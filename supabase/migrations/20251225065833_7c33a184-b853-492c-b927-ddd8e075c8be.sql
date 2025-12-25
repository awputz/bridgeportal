-- Clear all placeholder CRM data so each agent starts fresh
-- Keep crm_deal_stages as those are configuration

DELETE FROM crm_activities;
DELETE FROM crm_deals;
DELETE FROM crm_contacts;