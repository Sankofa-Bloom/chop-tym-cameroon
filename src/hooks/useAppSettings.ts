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

interface PaymentMode {
  mode: 'delivery' | 'online';
  online_payments_enabled: boolean;
}

export const useAppSettings = () => {
  const [pricingMode, setPricingMode] = useState<PricingMode>({ 
    mode: 'simple', 
    flat_price: 1000,
    availability_hours: { start: '09:00', end: '18:00' }
  });
  const [paymentMode, setPaymentMode] = useState<PaymentMode>({
    mode: 'delivery',
    online_payments_enabled: false
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
          table: 'app_settings'
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
        .select('key, value');

      if (error) throw error;
      
      data?.forEach(setting => {
        if (setting.key === 'pricing_mode' && setting.value && typeof setting.value === 'object' && 'mode' in setting.value) {
          setPricingMode(setting.value as unknown as PricingMode);
        }
        if (setting.key === 'payment_mode' && setting.value && typeof setting.value === 'object') {
          setPaymentMode(setting.value as unknown as PaymentMode);
        }
      });
    } catch (error) {
      console.error('Error fetching app settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return { pricingMode, paymentMode, loading };
};
