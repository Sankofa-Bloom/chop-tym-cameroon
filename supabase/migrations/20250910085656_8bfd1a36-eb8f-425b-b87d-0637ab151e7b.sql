-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 4.5,
  delivery_time TEXT DEFAULT '30-45 min',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dishes table
CREATE TABLE public.dishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create restaurant_dishes junction table for many-to-many relationship with pricing
CREATE TABLE public.restaurant_dishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  price INTEGER NOT NULL, -- Price in cents
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, dish_id)
);

-- Enable Row Level Security
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_dishes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a food delivery app)
CREATE POLICY "Anyone can view restaurants" 
ON public.restaurants 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view dishes" 
ON public.dishes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view restaurant dishes" 
ON public.restaurant_dishes 
FOR SELECT 
USING (true);

-- Create updated_at triggers
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dishes_updated_at
BEFORE UPDATE ON public.dishes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurant_dishes_updated_at
BEFORE UPDATE ON public.restaurant_dishes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample restaurants
INSERT INTO public.restaurants (name, description, image_url, rating, delivery_time) VALUES
('Mama Njema Kitchen', 'Authentic Cameroonian cuisine prepared with love and traditional spices', '/placeholder.svg', 4.8, '25-35 min'),
('Douala Delights', 'Fresh seafood and coastal specialties from the heart of Douala', '/placeholder.svg', 4.6, '30-40 min'),
('Yaoundé Flavors', 'Traditional dishes from the capital with a modern twist', '/placeholder.svg', 4.7, '35-45 min'),
('Bamenda Bites', 'Grassland cuisine featuring fresh vegetables and grilled meats', '/placeholder.svg', 4.5, '40-50 min');

-- Insert sample dishes
INSERT INTO public.dishes (name, description, image_url, category) VALUES
('Jollof Rice', 'Aromatic rice cooked in rich tomato sauce with spices and vegetables', '/src/assets/jollof-rice-hero.jpg', 'Rice Dishes'),
('Ndolé Stew', 'Traditional Cameroonian stew with groundnuts, bitter leaves, and your choice of meat or fish', '/src/assets/ndole-stew.jpg', 'Stews'),
('Grilled Fish with Attieké', 'Fresh fish grilled to perfection, served with cassava couscous', '/src/assets/grilled-fish-attieke.jpg', 'Seafood'),
('Poulet DG', 'Grilled chicken with fried plantains and vegetables in a rich sauce', '/placeholder.svg', 'Chicken'),
('Eru with Fufu', 'Traditional leafy vegetable soup served with pounded cassava', '/placeholder.svg', 'Traditional'),
('Pepper Soup', 'Spicy traditional soup with fish or meat and aromatic spices', '/placeholder.svg', 'Soups');

-- Insert restaurant-dish relationships with different prices
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, is_available) VALUES
-- Mama Njema Kitchen
((SELECT id FROM public.restaurants WHERE name = 'Mama Njema Kitchen'), (SELECT id FROM public.dishes WHERE name = 'Jollof Rice'), 2500, true),
((SELECT id FROM public.restaurants WHERE name = 'Mama Njema Kitchen'), (SELECT id FROM public.dishes WHERE name = 'Ndolé Stew'), 3500, true),
((SELECT id FROM public.restaurants WHERE name = 'Mama Njema Kitchen'), (SELECT id FROM public.dishes WHERE name = 'Poulet DG'), 4500, true),
((SELECT id FROM public.restaurants WHERE name = 'Mama Njema Kitchen'), (SELECT id FROM public.dishes WHERE name = 'Eru with Fufu'), 3000, true),

-- Douala Delights
((SELECT id FROM public.restaurants WHERE name = 'Douala Delights'), (SELECT id FROM public.dishes WHERE name = 'Grilled Fish with Attieké'), 4000, true),
((SELECT id FROM public.restaurants WHERE name = 'Douala Delights'), (SELECT id FROM public.dishes WHERE name = 'Pepper Soup'), 2800, true),
((SELECT id FROM public.restaurants WHERE name = 'Douala Delights'), (SELECT id FROM public.dishes WHERE name = 'Jollof Rice'), 2800, true),
((SELECT id FROM public.restaurants WHERE name = 'Douala Delights'), (SELECT id FROM public.dishes WHERE name = 'Ndolé Stew'), 3800, true),

-- Yaoundé Flavors
((SELECT id FROM public.restaurants WHERE name = 'Yaoundé Flavors'), (SELECT id FROM public.dishes WHERE name = 'Jollof Rice'), 2600, true),
((SELECT id FROM public.restaurants WHERE name = 'Yaoundé Flavors'), (SELECT id FROM public.dishes WHERE name = 'Poulet DG'), 4200, true),
((SELECT id FROM public.restaurants WHERE name = 'Yaoundé Flavors'), (SELECT id FROM public.dishes WHERE name = 'Eru with Fufu'), 3200, true),
((SELECT id FROM public.restaurants WHERE name = 'Yaoundé Flavors'), (SELECT id FROM public.dishes WHERE name = 'Pepper Soup'), 3000, true),

-- Bamenda Bites
((SELECT id FROM public.restaurants WHERE name = 'Bamenda Bites'), (SELECT id FROM public.dishes WHERE name = 'Grilled Fish with Attieké'), 3800, true),
((SELECT id FROM public.restaurants WHERE name = 'Bamenda Bites'), (SELECT id FROM public.dishes WHERE name = 'Jollof Rice'), 2400, true),
((SELECT id FROM public.restaurants WHERE name = 'Bamenda Bites'), (SELECT id FROM public.dishes WHERE name = 'Ndolé Stew'), 3600, true),
((SELECT id FROM public.restaurants WHERE name = 'Bamenda Bites'), (SELECT id FROM public.dishes WHERE name = 'Poulet DG'), 4300, true);

-- Enable realtime for all tables
ALTER TABLE public.restaurants REPLICA IDENTITY FULL;
ALTER TABLE public.dishes REPLICA IDENTITY FULL;
ALTER TABLE public.restaurant_dishes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.restaurants;
ALTER publication supabase_realtime ADD TABLE public.dishes;
ALTER publication supabase_realtime ADD TABLE public.restaurant_dishes;