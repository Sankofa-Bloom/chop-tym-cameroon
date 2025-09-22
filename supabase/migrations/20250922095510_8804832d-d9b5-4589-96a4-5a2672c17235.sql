-- Create payment methods configuration table
CREATE TABLE public.payment_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  icon_url text,
  fees text,
  processing_time text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active payment methods" 
ON public.payment_methods 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert payment methods" 
ON public.payment_methods 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update payment methods" 
ON public.payment_methods 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete payment methods" 
ON public.payment_methods 
FOR DELETE 
USING (is_admin());

-- Insert default payment methods
INSERT INTO public.payment_methods (name, code, description, display_order, fees, processing_time) VALUES
('Mobile Money', 'fapshi', 'Pay with Mobile Money (MTN, Orange) via Fapshi', 1, 'No additional fees', 'Instant'),
('Bank Transfer', 'swychr', 'Pay with bank transfer via Swychr', 2, 'No additional fees', '1-2 minutes'),
('Cash on Delivery', 'offline', 'Pay cash when your order is delivered', 3, 'No additional fees', 'Pay on delivery');

-- Add trigger for updated_at
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();