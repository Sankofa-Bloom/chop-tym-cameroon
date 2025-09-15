-- Clear existing invalid user_roles and create admin properly
DELETE FROM user_roles;

-- Create the admin user first
INSERT INTO auth_users (id, email, password_hash, is_verified, full_name, created_at)
VALUES (
  gen_random_uuid(),
  'choptym237@gmail.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'password'
  true,
  'Admin User',
  now()
) ON CONFLICT (email) DO NOTHING;

-- Create admin role for the user
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth_users
WHERE email = 'choptym237@gmail.com';