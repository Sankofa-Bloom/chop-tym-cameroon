-- Duplicate all restaurants to Limbe
INSERT INTO public.restaurants (
  name, description, image_url, rating, delivery_time, town, 
  exact_location, phone, opens_at, closes_at, is_open_now, 
  operating_days, is_popular, popular_order
)
SELECT 
  name, description, image_url, rating, delivery_time, 'Limbe' as town,
  exact_location, phone, opens_at, closes_at, is_open_now,
  operating_days, is_popular, popular_order
FROM public.restaurants 
WHERE town = 'Douala';

-- Duplicate all restaurant_dishes for the new Limbe restaurants
-- This creates a mapping between the new Limbe restaurants and dishes with the same pricing
INSERT INTO public.restaurant_dishes (
  restaurant_id, dish_id, price, is_available, currency, 
  available_from, available_until, available_days
)
SELECT 
  limbe_restaurants.id as restaurant_id,
  rd.dish_id,
  rd.price,
  rd.is_available,
  rd.currency,
  rd.available_from,
  rd.available_until,
  rd.available_days
FROM public.restaurant_dishes rd
JOIN public.restaurants douala_restaurants ON rd.restaurant_id = douala_restaurants.id
JOIN public.restaurants limbe_restaurants ON douala_restaurants.name = limbe_restaurants.name
WHERE douala_restaurants.town = 'Douala' AND limbe_restaurants.town = 'Limbe';