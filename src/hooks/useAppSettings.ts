import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PricingMode {
  mode: 'simple' | 'restaurant';
  flat_price?: number;
  availability_hours?: {
    start: string;
    end: string;
  };
}

export const useAppSettings = () => {
  const [pricingMode, setPricingMode] = useState<PricingMode>({ 
    mode: 'simple', 
    flat_price: 1000,
    availability_hours: { start: '09:00', end: '18:00' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    
    const channel = supabase
      .channel('app-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings',
          filter: 'key=eq.pricing_mode'
        },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'pricing_mode')
        .single();

      if (error) throw error;
      if (data?.value && typeof data.value === 'object' && 'mode' in data.value) {
        setPricingMode(data.value as unknown as PricingMode);
      }
    } catch (error) {
      console.error('Error fetching app settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return { pricingMode, loading };
};
