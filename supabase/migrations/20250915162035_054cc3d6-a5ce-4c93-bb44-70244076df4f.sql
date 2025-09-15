-- Update the user's password and ensure they can log in
-- Note: We'll use a known password hash for 'password'
UPDATE auth.users 
SET encrypted_password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'password'
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'choptym237@gmail.com';