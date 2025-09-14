-- Drop the existing generic order number trigger if it exists
DROP TRIGGER IF EXISTS set_order_number_trigger ON public.orders;

-- Create a new trigger that uses the town-specific order number generation
CREATE TRIGGER set_town_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_town_order_number();