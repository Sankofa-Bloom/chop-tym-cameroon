-- This migration will create an admin user through a custom signup process
-- Since we can't directly insert into auth.users via SQL, we'll create a trigger that will help
-- For now, we'll provide instructions for creating the admin account through the app

-- Create a function to help with admin user creation
CREATE OR REPLACE FUNCTION create_admin_user_role(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert admin role if it doesn't exist
  INSERT INTO user_roles (user_id, role)
  VALUES (user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- The admin user (choptym237@gmail.com) should be created through the signup process
-- Once created, this function can be called to assign admin role