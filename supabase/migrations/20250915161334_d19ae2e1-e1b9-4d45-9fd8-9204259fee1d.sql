-- Update the admin role creation function to work with unconfirmed users
CREATE OR REPLACE FUNCTION public.create_admin_user_role(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
BEGIN
  -- Get email from auth.users (works with both confirmed and unconfirmed users)
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;
  
  -- Check if this is the admin email
  IF user_email = 'choptym237@gmail.com' THEN
    -- Insert admin role if it doesn't exist
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    RAISE EXCEPTION 'Not authorized to grant admin role for email: %', user_email;
  END IF;
END;
$$;

-- Also create a direct function to assign admin role to existing user
CREATE OR REPLACE FUNCTION public.make_user_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Find user with admin email
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'choptym237@gmail.com' LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    RAISE EXCEPTION 'Admin user not found';
  END IF;
END;
$$;