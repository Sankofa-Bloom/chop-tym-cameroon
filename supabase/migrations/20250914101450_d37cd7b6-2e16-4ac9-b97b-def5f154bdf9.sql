-- Allow authenticated users to view their own orders based on phone number match

CREATE POLICY "Users can view their own orders by phone" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (
  customer_phone IN (
    SELECT phone 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND phone IS NOT NULL
  )
);