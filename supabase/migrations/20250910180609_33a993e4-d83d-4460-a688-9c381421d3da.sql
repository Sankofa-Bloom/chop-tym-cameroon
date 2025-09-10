-- Create delivery zones table
CREATE TABLE public.delivery_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  town TEXT NOT NULL,
  zone_name TEXT NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(town, zone_name)
);

-- Enable Row Level Security
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Create policies for delivery zones
CREATE POLICY "Anyone can view delivery zones" 
ON public.delivery_zones 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert delivery zones" 
ON public.delivery_zones 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update delivery zones" 
ON public.delivery_zones 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete delivery zones" 
ON public.delivery_zones 
FOR DELETE 
USING (is_admin());

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_delivery_zones_updated_at
BEFORE UPDATE ON public.delivery_zones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();