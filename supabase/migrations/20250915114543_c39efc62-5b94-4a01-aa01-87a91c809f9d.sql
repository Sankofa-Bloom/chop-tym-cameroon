-- Fix foreign key constraint to reference native auth.users instead of custom auth_users
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Clear existing invalid user_roles
DELETE FROM user_roles;

-- The admin user will be created through native Supabase auth signup
-- We'll create the role assignment for the admin user email
-- This will be populated once the user signs up through the auth system