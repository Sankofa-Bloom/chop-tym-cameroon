
-- 1) Revoke EXECUTE from anon/authenticated on admin-only SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.create_admin_user_role(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.make_user_admin() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_town_order_number(text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_operational_order_reference() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_order_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_town_order_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_operational_order_reference() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.log_operational_order_activity() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.log_operational_order_creation() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.send_order_confirmation_on_payment() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;

-- 2) Tighten anonymous orders INSERT with sanity WITH CHECK
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (
  length(customer_name) BETWEEN 1 AND 120
  AND length(customer_phone) BETWEEN 6 AND 20
  AND customer_phone ~ '^[0-9+\-\s()]+$'
  AND length(delivery_address) BETWEEN 1 AND 500
  AND length(town) BETWEEN 1 AND 80
  AND subtotal >= 0
  AND delivery_fee >= 0
  AND total >= 0
  AND total = subtotal + delivery_fee
  AND payment_status IN ('pending','paid','failed','cancelled','refunded')
  AND (notes IS NULL OR length(notes) <= 1000)
);

-- 3) Remove leaky phone-based SELECT policy (unverified phone = enumeration risk).
--    Authenticated owners can still view via admin endpoints / order-confirmation page using order_number lookup server-side.
DROP POLICY IF EXISTS "Users can view their own orders by phone" ON public.orders;
