-- Create towns table to manage active/inactive towns
CREATE TABLE public.towns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on towns table
ALTER TABLE public.towns ENABLE ROW LEVEL SECURITY;

-- Create policies for towns (public read access)
CREATE POLICY "Anyone can view towns" 
ON public.towns 
FOR SELECT 
USING (true);

-- Create waitlist table for inactive towns
CREATE TABLE public.town_waitlist (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  phone text NOT NULL,
  name text NOT NULL,
  town text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on waitlist table
ALTER TABLE public.town_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies for waitlist
CREATE POLICY "Anyone can insert waitlist entries" 
ON public.town_waitlist 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for updated_at on towns
CREATE TRIGGER update_towns_updated_at
BEFORE UPDATE ON public.towns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial towns with Limbe as active
INSERT INTO public.towns (name, is_active) VALUES 
('Limbe', true),
('Douala', true),
('Yaoundé', true),
('Bafoussam', false),
('Bamenda', false),
('Kribi', false),
('Buea', false);