-- Add popular restaurant management
ALTER TABLE public.restaurants 
ADD COLUMN is_popular boolean DEFAULT false,
ADD COLUMN popular_order integer DEFAULT null;

-- Create index for better performance
CREATE INDEX idx_restaurants_popular ON public.restaurants (is_popular, popular_order) WHERE is_popular = true;