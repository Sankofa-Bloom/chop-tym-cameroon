-- Create complements table
CREATE TABLE public.complements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XAF',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dish_complements junction table
CREATE TABLE public.dish_complements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dish_id UUID NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  complement_id UUID NOT NULL REFERENCES public.complements(id) ON DELETE CASCADE,
  is_required BOOLEAN NOT NULL DEFAULT false,
  max_quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(dish_id, complement_id)
);

-- Enable Row Level Security
ALTER TABLE public.complements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_complements ENABLE ROW LEVEL SECURITY;

-- Create policies for complements
CREATE POLICY "Anyone can view complements" 
ON public.complements 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert complements" 
ON public.complements 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update complements" 
ON public.complements 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete complements" 
ON public.complements 
FOR DELETE 
USING (is_admin());

-- Create policies for dish_complements
CREATE POLICY "Anyone can view dish complements" 
ON public.dish_complements 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert dish complements" 
ON public.dish_complements 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update dish complements" 
ON public.dish_complements 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete dish complements" 
ON public.dish_complements 
FOR DELETE 
USING (is_admin());

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_complements_updated_at
BEFORE UPDATE ON public.complements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dish_complements_updated_at
BEFORE UPDATE ON public.dish_complements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();