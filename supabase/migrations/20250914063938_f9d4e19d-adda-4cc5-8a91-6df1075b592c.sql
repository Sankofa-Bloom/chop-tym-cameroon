-- Add free_delivery column to towns table
ALTER TABLE public.towns 
ADD COLUMN free_delivery boolean NOT NULL DEFAULT false;

-- Create streets table
CREATE TABLE public.streets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  delivery_zone_id UUID NOT NULL REFERENCES public.delivery_zones(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on streets table
ALTER TABLE public.streets ENABLE ROW LEVEL SECURITY;

-- Create policies for streets table
CREATE POLICY "Anyone can view streets" 
ON public.streets 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert streets" 
ON public.streets 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update streets" 
ON public.streets 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete streets" 
ON public.streets 
FOR DELETE 
USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_streets_updated_at
  BEFORE UPDATE ON public.streets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();