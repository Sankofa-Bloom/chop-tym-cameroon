-- First, let's create a proper admin user using Supabase's auth system
-- We'll insert directly into auth.users and then add to our custom auth_users table

-- Insert into Supabase's auth.users table (this will give us a proper user_id)
WITH new_user AS (
  INSERT INTO auth.users (
    id,
    instance_id,
    aud, 
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated', 
    'choptym237@gmail.com',
    crypt('Sankofa@237', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin User"}'
  ) RETURNING id, email
),
-- Insert into our custom auth_users table for the edge function
auth_user AS (
  INSERT INTO auth_users (id, email, password_hash, is_verified, full_name, created_at)
  SELECT id, email, crypt('Sankofa@237', gen_salt('bf')), true, 'Admin User', now()
  FROM new_user
  RETURNING id
)
-- Insert admin role
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM new_user;