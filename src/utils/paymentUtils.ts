import { supabase } from "@/integrations/supabase/client";

export const checkPaymentStatus = async (transactionId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('swychr-status', {
      body: { transaction_id: transactionId }
    });

    if (error) {
      console.error('Error checking payment status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data?.data };
  } catch (error) {
    console.error('Payment status check failed:', error);
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