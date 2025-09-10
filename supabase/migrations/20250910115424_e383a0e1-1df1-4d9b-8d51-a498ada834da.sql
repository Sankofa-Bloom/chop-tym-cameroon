-- Update the order number function to use town-specific format with datetime
CREATE OR REPLACE FUNCTION public.generate_town_order_number(order_town TEXT)
RETURNS TEXT AS $$
DECLARE
  town_code TEXT;
  daily_count INTEGER;
  date_str TEXT;
BEGIN
  -- Get town code (first 3 letters uppercase)
  town_code := UPPER(SUBSTRING(order_town, 1, 3));
  
  -- Get date string in DDMMYYYY format
  date_str := TO_CHAR(NOW(), 'DDMMYYYY');
  
  -- Get daily count for this town
  SELECT COALESCE(COUNT(*), 0) + 1
  FROM public.orders 
  WHERE town = order_town 
  AND DATE(created_at) = CURRENT_DATE
  INTO daily_count;
  
  -- Return format: TownCode-DDMMYYYY-XXX
  RETURN town_code || '-' || date_str || '-' || LPAD(daily_count::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;