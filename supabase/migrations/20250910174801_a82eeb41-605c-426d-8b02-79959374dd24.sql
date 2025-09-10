-- Create enum for app roles (if not exists)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = is_admin.user_id
      AND role = 'admin'
  );
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- Create trigger for user_roles updated_at (if not exists)
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view their own role"
    ON public.user_roles
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage roles"
    ON public.user_roles
    FOR ALL
    USING (public.is_admin());

-- Update existing policies to admin-only

-- Dishes table - Admin only CRUD
DROP POLICY IF EXISTS "Authenticated users can insert dishes" ON public.dishes;
DROP POLICY IF EXISTS "Authenticated users can update dishes" ON public.dishes;
DROP POLICY IF EXISTS "Authenticated users can delete dishes" ON public.dishes;
DROP POLICY IF EXISTS "Only admins can insert dishes" ON public.dishes;
DROP POLICY IF EXISTS "Only admins can update dishes" ON public.dishes;
DROP POLICY IF EXISTS "Only admins can delete dishes" ON public.dishes;

CREATE POLICY "Only admins can insert dishes"
    ON public.dishes
    FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update dishes"
    ON public.dishes
    FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete dishes"
    ON public.dishes
    FOR DELETE
    USING (public.is_admin());

-- Restaurants table - Admin only CRUD
DROP POLICY IF EXISTS "Authenticated users can insert restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Authenticated users can update restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Authenticated users can delete restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Only admins can insert restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Only admins can update restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Only admins can delete restaurants" ON public.restaurants;

CREATE POLICY "Only admins can insert restaurants"
    ON public.restaurants
    FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update restaurants"
    ON public.restaurants
    FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete restaurants"
    ON public.restaurants
    FOR DELETE
    USING (public.is_admin());

-- Restaurant_dishes table - Admin only CRUD
DROP POLICY IF EXISTS "Authenticated users can insert restaurant dishes" ON public.restaurant_dishes;
DROP POLICY IF EXISTS "Authenticated users can update restaurant dishes" ON public.restaurant_dishes;
DROP POLICY IF EXISTS "Authenticated users can delete restaurant dishes" ON public.restaurant_dishes;
DROP POLICY IF EXISTS "Only admins can insert restaurant dishes" ON public.restaurant_dishes;
DROP POLICY IF EXISTS "Only admins can update restaurant dishes" ON public.restaurant_dishes;
DROP POLICY IF EXISTS "Only admins can delete restaurant dishes" ON public.restaurant_dishes;

CREATE POLICY "Only admins can insert restaurant dishes"
    ON public.restaurant_dishes
    FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update restaurant dishes"
    ON public.restaurant_dishes
    FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete restaurant dishes"
    ON public.restaurant_dishes
    FOR DELETE
    USING (public.is_admin());

-- Towns table - Admin only CRUD
DROP POLICY IF EXISTS "Only admins can insert towns" ON public.towns;
DROP POLICY IF EXISTS "Only admins can update towns" ON public.towns;
DROP POLICY IF EXISTS "Only admins can delete towns" ON public.towns;

CREATE POLICY "Only admins can insert towns"
    ON public.towns
    FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update towns"
    ON public.towns
    FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete towns"
    ON public.towns
    FOR DELETE
    USING (public.is_admin());

-- Town waitlist - Admin can view all entries
DROP POLICY IF EXISTS "Only admins can view waitlist" ON public.town_waitlist;
DROP POLICY IF EXISTS "Only admins can update waitlist" ON public.town_waitlist;
DROP POLICY IF EXISTS "Only admins can delete waitlist" ON public.town_waitlist;

CREATE POLICY "Only admins can view waitlist"
    ON public.town_waitlist
    FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Only admins can update waitlist"
    ON public.town_waitlist
    FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete waitlist"
    ON public.town_waitlist
    FOR DELETE
    USING (public.is_admin());