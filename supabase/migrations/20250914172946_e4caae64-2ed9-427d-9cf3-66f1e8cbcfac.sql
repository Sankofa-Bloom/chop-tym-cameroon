-- Ensure only the town-specific trigger exists
DROP TRIGGER IF EXISTS set_order_number_before_insert ON public.orders;
DROP TRIGGER IF EXISTS set_town_order_number_before_insert ON public.orders;

-- Create trigger to set order_number based on town-specific format
CREATE TRIGGER set_town_order_number_before_insert
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_town_order_number();