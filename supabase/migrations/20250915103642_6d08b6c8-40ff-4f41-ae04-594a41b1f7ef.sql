-- Create admin user (fixed - removed updated_at column)
INSERT INTO auth_users (id, email, password_hash, is_verified, full_name, created_at)
VALUES (
  gen_random_uuid(),
  'choptym237@gmail.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- This is bcrypt hash of 'password'
  true,
  'Admin User',
  now()
);

-- Create admin role for the user
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth_users
WHERE email = 'choptym237@gmail.com';