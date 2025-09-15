import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Complement {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  is_active: boolean;
}

export interface DishComplement {
  id: string;
  dish_id: string;
  complement_id: string;
  is_required: boolean;
  max_quantity: number;
  complement: Complement;
}

export function useComplements() {
  const [complements, setComplements] = useState<Complement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComplements();
  }, []);

  const fetchComplements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('complements')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setComplements(data || []);
    } catch (err) {
      console.error('Error fetching complements:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { complements, loading, error, refetch: fetchComplements };
}

export function useDishComplements(dishId?: string) {
  const [dishComplements, setDishComplements] = useState<DishComplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dishId) {
      fetchDishComplements(dishId);
    } else {
      setDishComplements([]);
      setLoading(false);
    }
  }, [dishId]);

  const fetchDishComplements = async (dishId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dish_complements')
        .select(`
          *,
          complement:complements(*)
        `)
        .eq('dish_id', dishId)
        .eq('complement.is_active', true)
        .order('is_required', { ascending: false });

      if (error) throw error;
      setDishComplements(data || []);
    } catch (err) {
      console.error('Error fetching dish complements:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { dishComplements, loading, error, refetch: () => dishId && fetchDishComplements(dishId) };
}