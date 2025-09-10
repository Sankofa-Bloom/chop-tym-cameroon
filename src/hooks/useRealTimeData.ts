import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  rating: number;
  delivery_time: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
}

export interface RestaurantDish {
  id: string;
  restaurant_id: string;
  dish_id: string;
  price: number;
  is_available: boolean;
  restaurant: Restaurant;
  dish: Dish;
}

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;
        setRestaurants(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();

    // Set up real-time subscription
    const channel = supabase
      .channel('restaurants-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'restaurants'
        },
        () => {
          fetchRestaurants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { restaurants, loading, error };
};

export const useDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const { data, error } = await supabase
          .from('dishes')
          .select('*')
          .order('name');

        if (error) throw error;
        setDishes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();

    // Set up real-time subscription
    const channel = supabase
      .channel('dishes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dishes'
        },
        () => {
          fetchDishes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { dishes, loading, error };
};

export const useRestaurantDishes = () => {
  const [restaurantDishes, setRestaurantDishes] = useState<RestaurantDish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantDishes = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurant_dishes')
          .select(`
            *,
            restaurant:restaurants(*),
            dish:dishes(*)
          `)
          .eq('is_available', true)
          .order('price');

        if (error) throw error;
        setRestaurantDishes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDishes();

    // Set up real-time subscription
    const channel = supabase
      .channel('restaurant-dishes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'restaurant_dishes'
        },
        () => {
          fetchRestaurantDishes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { restaurantDishes, loading, error };
};

export const useRestaurantsByDish = (dishId: string) => {
  const [restaurantDishes, setRestaurantDishes] = useState<{ 
    id: string; 
    restaurant_id: string; 
    dish_id: string; 
    price: number; 
    is_available: boolean; 
    restaurant: Restaurant;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantsByDish = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurant_dishes')
          .select(`
            *,
            restaurant:restaurants(*)
          `)
          .eq('dish_id', dishId)
          .eq('is_available', true)
          .order('price');

        if (error) throw error;
        setRestaurantDishes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (dishId) {
      fetchRestaurantsByDish();
    }

    // Set up real-time subscription
    const channel = supabase
      .channel(`restaurant-dishes-${dishId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'restaurant_dishes',
          filter: `dish_id=eq.${dishId}`
        },
        () => {
          fetchRestaurantsByDish();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dishId]);

  return { restaurantDishes, loading, error };
};