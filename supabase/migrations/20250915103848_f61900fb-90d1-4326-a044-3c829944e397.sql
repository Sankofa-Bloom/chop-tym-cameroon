-- Fix foreign key reference and create admin user properly
-- First drop the foreign key constraint if it exists
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

-- Add foreign key to auth_users instead of auth.users
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE;

-- Now create the admin user in auth_users
INSERT INTO auth_users (id, email, password_hash, is_verified, full_name, created_at)
VALUES (
  gen_random_uuid(),
  'choptym237@gmail.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'password'
  true,
  'Admin User',
  now()
);

-- Create admin role for the user
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth_users
WHERE email = 'choptym237@gmail.com';