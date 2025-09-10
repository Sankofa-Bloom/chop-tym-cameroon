-- Enable authenticated users to manage all content for admin dashboard

-- Update restaurants table policies to allow authenticated users to manage content
DROP POLICY IF EXISTS "Anyone can view restaurants" ON public.restaurants;

CREATE POLICY "Anyone can view restaurants" 
ON public.restaurants 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert restaurants" 
ON public.restaurants 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update restaurants" 
ON public.restaurants 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete restaurants" 
ON public.restaurants 
FOR DELETE 
TO authenticated 
USING (true);

-- Update dishes table policies
DROP POLICY IF EXISTS "Anyone can view dishes" ON public.dishes;

CREATE POLICY "Anyone can view dishes" 
ON public.dishes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert dishes" 
ON public.dishes 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update dishes" 
ON public.dishes 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete dishes" 
ON public.dishes 
FOR DELETE 
TO authenticated 
USING (true);

-- Update restaurant_dishes table policies
DROP POLICY IF EXISTS "Anyone can view restaurant dishes" ON public.restaurant_dishes;

CREATE POLICY "Anyone can view restaurant dishes" 
ON public.restaurant_dishes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert restaurant dishes" 
ON public.restaurant_dishes 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update restaurant dishes" 
ON public.restaurant_dishes 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete restaurant dishes" 
ON public.restaurant_dishes 
FOR DELETE 
TO authenticated 
USING (true);