-- Add division column to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS division text DEFAULT 'Investment Sales';

-- Backfill existing records based on current deal_type values
UPDATE transactions 
SET division = CASE 
  WHEN deal_type = 'Residential' THEN 'Residential'
  WHEN deal_type = 'Commercial' THEN 'Commercial'
  WHEN deal_type IN ('Investment Sales', 'Sale') THEN 'Investment Sales'
  WHEN deal_type = 'Lease' THEN 'Residential'
  ELSE 'Investment Sales'
END
WHERE division IS NULL OR division = 'Investment Sales';

-- Add index for filtering performance
CREATE INDEX IF NOT EXISTS idx_transactions_division ON transactions(division);