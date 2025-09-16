import { supabase } from "@/integrations/supabase/client";

export const checkPaymentStatus = async (sessionId: string, reference?: string) => {
  try {
    // For Swychr, we use the reference (payment_link_id) or sessionId as the payment_link_id
    const paymentLinkId = reference || sessionId;
    
    if (!paymentLinkId) {
      return { success: false, error: 'No payment reference provided' };
    }

    const { data, error } = await supabase.functions.invoke('swychr-status', {
      body: { payment_link_id: paymentLinkId }
    });

    if (error) {
      console.error('Error checking Swychr payment status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data?.data || data };
  } catch (error) {
    console.error('Swychr payment status check failed:', error);
    return { success: false, error: 'Failed to check payment status' };
  }
};

export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `CT-${date}-${random}`;
};