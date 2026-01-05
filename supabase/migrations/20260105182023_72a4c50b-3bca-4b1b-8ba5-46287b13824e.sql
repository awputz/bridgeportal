-- Fix function search path for security
CREATE OR REPLACE FUNCTION public.set_activity_division()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If division is explicitly set, keep it
  IF NEW.division IS NOT NULL AND NEW.division != 'investment-sales' THEN
    RETURN NEW;
  END IF;
  
  -- Try to get division from linked deal
  IF NEW.deal_id IS NOT NULL THEN
    SELECT division INTO NEW.division 
    FROM public.crm_deals WHERE id = NEW.deal_id;
  -- Otherwise try from linked contact
  ELSIF NEW.contact_id IS NOT NULL THEN
    SELECT division INTO NEW.division 
    FROM public.crm_contacts WHERE id = NEW.contact_id;
  END IF;
  
  -- Default to investment-sales if still null
  IF NEW.division IS NULL THEN
    NEW.division := 'investment-sales';
  END IF;
  
  RETURN NEW;
END;
$$;