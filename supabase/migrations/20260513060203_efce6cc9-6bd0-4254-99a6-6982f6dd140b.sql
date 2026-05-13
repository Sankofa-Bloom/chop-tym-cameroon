
-- Tighten town_waitlist insert (was WITH CHECK true)
DROP POLICY IF EXISTS "Anyone can insert waitlist entries" ON public.town_waitlist;
CREATE POLICY "Anyone can insert waitlist entries"
ON public.town_waitlist
FOR INSERT
TO public
WITH CHECK (
  length(name) BETWEEN 1 AND 120
  AND length(email) BETWEEN 3 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(phone) BETWEEN 6 AND 20
  AND phone ~ '^[0-9+\-\s()]+$'
  AND length(town) BETWEEN 1 AND 80
);

-- Hard re-revoke on all internal trigger/admin helper functions from every API role
DO $$
DECLARE
  fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'public.create_admin_user_role(uuid)',
    'public.make_user_admin()',
    'public.generate_order_number()',
    'public.generate_town_order_number(text)',
    'public.generate_operational_order_reference()',
    'public.set_order_number()',
    'public.set_town_order_number()',
    'public.set_operational_order_reference()',
    'public.log_operational_order_activity()',
    'public.log_operational_order_creation()',
    'public.send_order_confirmation_on_payment()',
    'public.handle_new_user()',
    'public.update_updated_at_column()',
    'public.is_restaurant_open(public.restaurants)'
  ]
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn);
  END LOOP;
END $$;
