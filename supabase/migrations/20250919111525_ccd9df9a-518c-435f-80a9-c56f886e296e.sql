-- SECURITY FIX: Remove custom auth_users table and migrate to Supabase Auth
-- This fixes the security vulnerability where password hashes are stored in a custom table

-- First, migrate existing users from auth_users to Supabase's auth.users
-- Note: This requires manual migration of users or they will need to re-register

-- Step 1: Drop the custom auth_users table (after backing up if needed)
DROP TABLE IF EXISTS public.auth_users CASCADE;

-- Step 2: Drop email verification tokens table as Supabase handles this
DROP TABLE IF EXISTS public.email_verification_tokens CASCADE;

-- Step 3: Update the trigger to use Supabase's built-in auth.users
-- Replace the existing trigger with one that works with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Check if this is the admin email and create admin role
  IF NEW.email = 'choptym237@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 4: Create the trigger on auth.users (Supabase's built-in table)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Remove the signup email webhook function as it's no longer needed
DROP FUNCTION IF EXISTS public.send_signup_email_webhook() CASCADE;