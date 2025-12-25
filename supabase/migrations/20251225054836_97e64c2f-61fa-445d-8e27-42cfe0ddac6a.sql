-- Add commission column to crm_deals for agent-entered actual commission
ALTER TABLE public.crm_deals 
ADD COLUMN IF NOT EXISTS commission numeric NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.crm_deals.commission IS 'Agent-entered actual commission amount (not calculated/estimated)';

-- Add commission column to transactions table for historical data
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS commission numeric NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.transactions.commission IS 'Agent-entered actual commission amount (not calculated/estimated)';