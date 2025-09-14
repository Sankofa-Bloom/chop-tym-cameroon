-- Fix the orders table RLS policies to properly secure customer data

-- Drop the broken customer policy that has condition 'false'
DROP POLICY IF EXISTS "Customers can view own orders with verification" ON public.orders;

-- The orders table should only be readable by admins
-- Customers get order confirmation immediately upon creation but cannot query later
-- This prevents exposure of other customers' personal information

-- Keep existing policies:
-- "Anyone can insert orders" - allows public order creation
-- "Admins can view all orders" - allows admin access  
-- "Only admins can update order status" - allows admin updates

-- Add a comment explaining the security model
COMMENT ON TABLE public.orders IS 'Orders contain sensitive customer data. Only admins can read orders. Customers receive order confirmation immediately upon creation but cannot query orders later to protect other customers privacy.';