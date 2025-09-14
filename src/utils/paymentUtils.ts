import { supabase } from "@/integrations/supabase/client";

export const checkPaymentStatus = async (sessionId: string, reference?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('fapshi-status', {
      body: { sessionId, reference }
    });

    if (error) {
      console.error('Error checking Fapshi payment status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data?.data };
  } catch (error) {
    console.error('Fapshi payment status check failed:', error);
    return { success: false, error: 'Failed to check payment status' };
  }
};

export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `CT-${date}-${random}`;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(price);
};