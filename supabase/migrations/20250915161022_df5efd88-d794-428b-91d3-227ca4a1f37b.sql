-- Restrict admin role grant to the approved email via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.create_admin_user_role(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;
  IF user_email = 'choptym237@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    RAISE EXCEPTION 'Not authorized to grant admin role';
  END IF;
END;
$$;