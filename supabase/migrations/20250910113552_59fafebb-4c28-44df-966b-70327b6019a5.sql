-- Add currency support and location fields to restaurants
ALTER TABLE public.restaurants 
ADD COLUMN town TEXT NOT NULL DEFAULT 'Douala',
ADD COLUMN exact_location TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN opens_at TIME DEFAULT '08:00:00'::TIME,
ADD COLUMN closes_at TIME DEFAULT '22:00:00'::TIME,
ADD COLUMN is_open_now BOOLEAN DEFAULT true,
ADD COLUMN operating_days INTEGER[] DEFAULT '{1,2,3,4,5,6,7}'::INTEGER[]; -- 1=Monday, 7=Sunday

-- Add currency and availability tracking to restaurant_dishes
ALTER TABLE public.restaurant_dishes
ADD COLUMN currency TEXT NOT NULL DEFAULT 'XAF',
ADD COLUMN available_from TIME DEFAULT '08:00:00'::TIME,
ADD COLUMN available_until TIME DEFAULT '22:00:00'::TIME,
ADD COLUMN available_days INTEGER[] DEFAULT '{1,2,3,4,5,6,7}'::INTEGER[];

-- Update existing prices to be in XAF (assuming current prices are in cents)
-- Convert from cents to XAF (1 USD = ~600 XAF, so multiply by 6)
UPDATE public.restaurant_dishes SET price = price * 6 WHERE currency = 'XAF';

-- Add town field to orders for town-specific order numbers
ALTER TABLE public.orders
ADD COLUMN town TEXT NOT NULL DEFAULT 'Douala';

-- Create a function to generate town-specific order numbers
CREATE OR REPLACE FUNCTION public.generate_town_order_number(order_town TEXT)
RETURNS TEXT AS $$
DECLARE
  town_code TEXT;
  daily_count INTEGER;
BEGIN
  -- Get town code (first 3 letters uppercase)
  town_code := UPPER(SUBSTRING(order_town, 1, 3));
  
  -- Get daily count for this town
  SELECT COALESCE(COUNT(*), 0) + 1
  FROM public.orders 
  WHERE town = order_town 
  AND DATE(created_at) = CURRENT_DATE
  INTO daily_count;
  
  -- Return format: TownCode-YYYYMMDD-XXX
  RETURN town_code || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(daily_count::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the order number trigger to use town-specific numbers
CREATE OR REPLACE FUNCTION public.set_town_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number = generate_town_order_number(NEW.town);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for town-specific order numbers
DROP TRIGGER IF EXISTS set_order_number_trigger ON public.orders;
CREATE TRIGGER set_town_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_town_order_number();

-- Create function to check if restaurant is currently open
CREATE OR REPLACE FUNCTION public.is_restaurant_open(restaurant_row public.restaurants)
RETURNS BOOLEAN AS $$
DECLARE
  check_time TIME;
  check_day INTEGER;
BEGIN
  check_time := CURRENT_TIME;
  check_day := EXTRACT(DOW FROM CURRENT_DATE); -- 0=Sunday, 6=Saturday
  check_day := CASE WHEN check_day = 0 THEN 7 ELSE check_day END; -- Convert to 1=Monday, 7=Sunday
  
  -- Check if restaurant is manually marked as closed
  IF NOT restaurant_row.is_open_now THEN
    RETURN FALSE;
  END IF;
  
  -- Check if today is in operating days
  IF NOT (check_day = ANY(restaurant_row.operating_days)) THEN
    RETURN FALSE;
  END IF;
  
  -- Check if current time is within operating hours
  IF check_time >= restaurant_row.opens_at AND check_time <= restaurant_row.closes_at THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add index for better performance on town-based queries
CREATE INDEX IF NOT EXISTS idx_restaurants_town ON public.restaurants(town);
CREATE INDEX IF NOT EXISTS idx_orders_town_date ON public.orders(town, created_at);