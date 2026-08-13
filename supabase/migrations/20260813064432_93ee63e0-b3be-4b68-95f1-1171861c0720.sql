CREATE OR REPLACE FUNCTION public.get_rider_locations()
RETURNS TABLE (
  id uuid,
  name text,
  phone text,
  current_status public.rider_status,
  active_orders_count integer,
  max_active_orders integer,
  last_seen timestamptz,
  lat double precision,
  lng double precision
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.name, r.phone, r.current_status,
         COALESCE(r.active_orders_count, 0),
         COALESCE(r.max_active_orders, 3),
         r.last_seen,
         CASE WHEN r.current_location IS NULL THEN NULL ELSE ST_Y(r.current_location::geometry) END,
         CASE WHEN r.current_location IS NULL THEN NULL ELSE ST_X(r.current_location::geometry) END
  FROM public.riders r
  WHERE r.is_active = true
    AND public.has_operations_access(auth.uid());
$$;

REVOKE ALL ON FUNCTION public.get_rider_locations() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_rider_locations() TO authenticated;