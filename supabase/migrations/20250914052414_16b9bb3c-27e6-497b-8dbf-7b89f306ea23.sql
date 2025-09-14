-- Remove overly permissive policies that expose customer data
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Only admins can view all orders" ON public.orders;

-- Create secure policies
-- Allow only admins to view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (is_admin());

-- Allow only admins to update orders (for status changes, etc.)
CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE USING (is_admin());

-- Keep the insert policy for customers to place orders
-- "Anyone can insert orders" policy remains as is

-- Optional: Add policy for customers to view their own orders by order number and phone
-- This provides a secure way for customers to track their orders
CREATE POLICY "Customers can view own orders with verification" ON public.orders
FOR SELECT USING (
  -- Allow access if user provides matching order_number and customer_phone
  -- This will be used by a secure lookup function in the application
  false -- Disabled by default, will be enabled through application logic
);