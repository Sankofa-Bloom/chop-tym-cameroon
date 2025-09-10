import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Town {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTowns = () => {
  const [towns, setTowns] = useState<Town[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTowns = async () => {
      try {
        const { data, error } = await supabase
          .from('towns')
          .select('*')
          .order('name');

        if (error) throw error;
        setTowns(data || []);
      } catch (error) {
        console.error('Error fetching towns:', error);
        setError('Failed to fetch towns');
      } finally {
        setLoading(false);
      }
    };

    fetchTowns();

    // Set up real-time subscription
    const subscription = supabase
      .channel('towns_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'towns'
        },
        (payload) => {
          console.log('Towns change received!', payload);
          fetchTowns();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const activeTowns = towns.filter(town => town.is_active);
  const inactiveTowns = towns.filter(town => !town.is_active);

  return {
    towns,
    activeTowns,
    inactiveTowns,
    loading,
    error
  };
};