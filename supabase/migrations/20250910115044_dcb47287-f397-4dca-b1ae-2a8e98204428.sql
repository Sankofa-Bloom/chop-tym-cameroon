-- Insert traditional local dishes
INSERT INTO public.dishes (name, description, category, image_url) VALUES
('Eru', 'Traditional vegetable dish with waterleaf, crayfish, and palm oil.', 'Local Dishes', '/src/assets/ndole-stew.jpg'),
('Kati-Kati', 'Grilled chicken cooked in red oil and spices, served with corn fufu.', 'Local Dishes', '/src/assets/grilled-fish-attieke.jpg'),
('Ekwang', 'Grated cocoyams wrapped in cocoyam leaves, simmered in palm oil sauce.', 'Local Dishes', '/src/assets/ndole-stew.jpg'),
('Achu', 'Yellow soup with pounded cocoyams and meat.', 'Local Dishes', '/src/assets/jollof-rice-hero.jpg'),
('Ndole', 'Bitterleaf and peanut stew served with rice, plantains, or yams.', 'Local Dishes', '/src/assets/ndole-stew.jpg'),
('Koki', 'Steamed pudding of ground black-eyed peas, often wrapped in banana leaves.', 'Local Dishes', '/src/assets/jollof-rice-hero.jpg'),
('Pork Pepper Soup', 'Spicy broth made with pork, country onions, and njangsa.', 'Local Dishes', '/src/assets/ndole-stew.jpg'),
('Kwa Coco', 'Steamed grated cocoyam, often served with spicy banga soup.', 'Local Dishes', '/src/assets/jollof-rice-hero.jpg'),
('Ogbono Soup', 'Nigerian-style draw soup made from wild mango seeds and assorted meat.', 'Local Dishes', '/src/assets/ndole-stew.jpg'),
('Bongo (Mbongo Tchobi)', 'Dark, spicy stew made with traditional spices and smoked fish.', 'Local Dishes', '/src/assets/ndole-stew.jpg'),
('Rice', 'Fried, jollof, or plain rice served with various sauces and proteins.', 'Local Dishes', '/src/assets/jollof-rice-hero.jpg'),
('Bush Meat', 'Grilled or stewed wild meat delicacy, usually seasonal.', 'Local Dishes', '/src/assets/grilled-fish-attieke.jpg'),
('Grilled Chicken', 'Marinated chicken grilled to perfection with local spices.', 'Local Dishes', '/src/assets/grilled-fish-attieke.jpg'),
('Mpu - Fish', 'Steamed freshwater fish seasoned and wrapped in leaves.', 'Local Dishes', '/src/assets/grilled-fish-attieke.jpg');

-- Insert new restaurants that don't exist yet
INSERT INTO public.restaurants (name, description, town, phone, opens_at, closes_at, is_open_now, operating_days, rating, delivery_time, image_url) VALUES
('IYA BUEA', 'Authentic local cuisine and traditional dishes', 'Douala', '+237 677 123 456', '08:00:00', '22:00:00', true, '{1,2,3,4,5,6,7}', 4.6, '25-35 min', '/src/assets/ndole-stew.jpg'),
('G&G Restaurant', 'Popular local spot serving traditional and modern dishes', 'Douala', '+237 678 234 567', '09:00:00', '23:00:00', true, '{1,2,3,4,5,6,7}', 4.4, '30-40 min', '/src/assets/jollof-rice-hero.jpg'),
('Tantie Hilary''s Spot', 'Family-run restaurant specializing in local delicacies', 'Douala', '+237 679 345 678', '07:00:00', '21:00:00', true, '{1,2,3,4,5,6,7}', 4.5, '20-30 min', '/src/assets/ndole-stew.jpg'),
('Jam Rock', 'Trendy restaurant with a mix of local and continental dishes', 'Douala', '+237 680 456 789', '10:00:00', '24:00:00', true, '{1,2,3,4,5,6,7}', 4.3, '35-45 min', '/src/assets/grilled-fish-attieke.jpg'),
('Velda''s Recipes', 'Home-style cooking with authentic traditional recipes', 'Douala', '+237 681 567 890', '08:30:00', '20:30:00', true, '{1,2,3,4,5,6,7}', 4.7, '25-35 min', '/src/assets/ndole-stew.jpg'),
('Je''s Restaurant', 'Modern restaurant serving local and international cuisine', 'Douala', '+237 682 678 901', '09:00:00', '22:30:00', true, '{1,2,3,4,5,6,7}', 4.2, '30-40 min', '/src/assets/jollof-rice-hero.jpg'),
('Top Food Restaurant', 'Premium dining with traditional and contemporary dishes', 'Douala', '+237 683 789 012', '08:00:00', '23:00:00', true, '{1,2,3,4,5,6,7}', 4.5, '20-30 min', '/src/assets/ndole-stew.jpg'),
('Local Vendors', 'Street food and local specialties', 'Douala', '+237 684 890 123', '07:00:00', '19:00:00', true, '{1,2,3,4,5,6,7}', 4.0, '15-25 min', '/src/assets/jollof-rice-hero.jpg'),
('Onye Naija Restaurant', 'Nigerian and Cameroonian cuisine', 'Douala', '+237 685 901 234', '09:00:00', '22:00:00', true, '{1,2,3,4,5,6,7}', 4.4, '30-40 min', '/src/assets/ndole-stew.jpg'),
('Oxford Guest House', 'Guest house restaurant with continental and local dishes', 'Douala', '+237 686 012 345', '06:00:00', '23:00:00', true, '{1,2,3,4,5,6,7}', 4.1, '25-35 min', '/src/assets/jollof-rice-hero.jpg'),
('Students Restaurant', 'Affordable meals for students and locals', 'Douala', '+237 687 123 456', '07:00:00', '21:00:00', true, '{1,2,3,4,5,6,7}', 3.9, '20-30 min', '/src/assets/jollof-rice-hero.jpg'),
('Fork''n Fingers', 'Fast casual dining with local and international options', 'Douala', '+237 688 234 567', '10:00:00', '22:00:00', true, '{1,2,3,4,5,6,7}', 4.2, '25-35 min', '/src/assets/grilled-fish-attieke.jpg'),
('Traditional Vendors', 'Local market vendors selling traditional dishes', 'Douala', '+237 689 345 678', '06:00:00', '18:00:00', true, '{1,2,3,4,5,6,7}', 4.0, '15-25 min', '/src/assets/ndole-stew.jpg'),
('Local Bush Meat Vendors', 'Specialized vendors for wild game and bush meat', 'Douala', '+237 690 456 789', '08:00:00', '20:00:00', true, '{1,2,3,4,5,6}', 4.1, '20-30 min', '/src/assets/grilled-fish-attieke.jpg');

-- Now create the restaurant_dishes mappings with appropriate pricing in XAF
-- Eru - served by IYA BUEA, G&G Restaurant, Tantie Hilary's Spot, Jam Rock
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id, 
  CASE r.name 
    WHEN 'IYA BUEA' THEN 2500
    WHEN 'G&G Restaurant' THEN 3000
    WHEN 'Tantie Hilary''s Spot' THEN 2200
    WHEN 'Jam Rock' THEN 3200
  END as price,
  'XAF', true
FROM restaurants r, dishes d 
WHERE d.name = 'Eru' 
AND r.name IN ('IYA BUEA', 'G&G Restaurant', 'Tantie Hilary''s Spot', 'Jam Rock');

-- Kati-Kati - served by G&G Restaurant, Jam Rock, Tantie Hilary's Spot
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'G&G Restaurant' THEN 3500
    WHEN 'Jam Rock' THEN 3800
    WHEN 'Tantie Hilary''s Spot' THEN 3200
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Kati-Kati'
AND r.name IN ('G&G Restaurant', 'Jam Rock', 'Tantie Hilary''s Spot');

-- Ekwang - served by Velda's Recipes, Je's Restaurant, Tantie Hilary's Spot, IYA BUEA
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'Velda''s Recipes' THEN 2800
    WHEN 'Je''s Restaurant' THEN 3100
    WHEN 'Tantie Hilary''s Spot' THEN 2600
    WHEN 'IYA BUEA' THEN 2700
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Ekwang'
AND r.name IN ('Velda''s Recipes', 'Je''s Restaurant', 'Tantie Hilary''s Spot', 'IYA BUEA');

-- Achu - served by IYA BUEA, Tantie Hilary's Spot
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'IYA BUEA' THEN 3000
    WHEN 'Tantie Hilary''s Spot' THEN 2800
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Achu'
AND r.name IN ('IYA BUEA', 'Tantie Hilary''s Spot');

-- Ndole - served by IYA BUEA, Top Food Restaurant
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'IYA BUEA' THEN 2800
    WHEN 'Top Food Restaurant' THEN 3200
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Ndole'
AND r.name IN ('IYA BUEA', 'Top Food Restaurant');

-- Koki - served by Top Food Restaurant, Local Vendors
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'Top Food Restaurant' THEN 2000
    WHEN 'Local Vendors' THEN 1500
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Koki'
AND r.name IN ('Top Food Restaurant', 'Local Vendors');

-- Pork Pepper Soup - served by Velda's Recipes, IYA BUEA
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'Velda''s Recipes' THEN 3500
    WHEN 'IYA BUEA' THEN 3200
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Pork Pepper Soup'
AND r.name IN ('Velda''s Recipes', 'IYA BUEA');

-- Kwa Coco - served by IYA BUEA
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id, 2200, 'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Kwa Coco'
AND r.name = 'IYA BUEA';

-- Ogbono Soup - served by Onye Naija Restaurant
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id, 2800, 'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Ogbono Soup'
AND r.name = 'Onye Naija Restaurant';

-- Bongo (Mbongo Tchobi) - served by IYA BUEA
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id, 3500, 'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Bongo (Mbongo Tchobi)'
AND r.name = 'IYA BUEA';

-- Rice - served by Oxford Guest House, Students Restaurant, Fork'n Fingers
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'Oxford Guest House' THEN 1800
    WHEN 'Students Restaurant' THEN 1200
    WHEN 'Fork''n Fingers' THEN 1600
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Rice'
AND r.name IN ('Oxford Guest House', 'Students Restaurant', 'Fork''n Fingers');

-- Bush Meat - served by IYA BUEA, Local Bush Meat Vendors
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'IYA BUEA' THEN 4500
    WHEN 'Local Bush Meat Vendors' THEN 4000
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Bush Meat'
AND r.name IN ('IYA BUEA', 'Local Bush Meat Vendors');

-- Grilled Chicken - served by IYA BUEA, G&G Restaurant, Jam Rock
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'IYA BUEA' THEN 3200
    WHEN 'G&G Restaurant' THEN 3500
    WHEN 'Jam Rock' THEN 3800
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Grilled Chicken'
AND r.name IN ('IYA BUEA', 'G&G Restaurant', 'Jam Rock');

-- Mpu - Fish - served by IYA BUEA, Traditional Vendors
INSERT INTO public.restaurant_dishes (restaurant_id, dish_id, price, currency, is_available)
SELECT r.id, d.id,
  CASE r.name
    WHEN 'IYA BUEA' THEN 2800
    WHEN 'Traditional Vendors' THEN 2400
  END as price,
  'XAF', true
FROM restaurants r, dishes d
WHERE d.name = 'Mpu - Fish'
AND r.name IN ('IYA BUEA', 'Traditional Vendors');