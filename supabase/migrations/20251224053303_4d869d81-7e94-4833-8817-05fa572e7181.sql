-- Add is_profile_only column to transactions table
-- Transactions with is_profile_only = true will only appear in agent profile popups
ALTER TABLE public.transactions 
ADD COLUMN is_profile_only boolean NOT NULL DEFAULT false;