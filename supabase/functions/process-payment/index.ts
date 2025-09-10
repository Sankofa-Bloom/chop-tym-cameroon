import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const swychrEmail = Deno.env.get('SWYCHR_API_EMAIL')!;
const swychrPassword = Deno.env.get('SWYCHR_API_PASSWORD')!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSwychrAuthToken() {
  const response = await fetch('https://api.accountpe.com/api/payin/admin/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: swychrEmail,
      password: swychrPassword
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to authenticate with Swychr: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data?.token || data.token;
}

async function createPaymentLink(authToken: string, orderData: any) {
  const response = await fetch('https://api.accountpe.com/api/payin/create_payment_links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      country_code: 'CM',
      name: orderData.customerInfo.fullName,
      email: orderData.customerInfo.email || `${orderData.customerInfo.phone}@choptym.com`,
      mobile: orderData.customerInfo.phone,
      amount: orderData.total,
      transaction_id: orderData.orderNumber,
      description: `ChopTym Order - ${orderData.orderNumber}`,
      pass_digital_charge: true
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to create payment link: ${response.statusText}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData } = await req.json();
    console.log('Processing payment for order:', orderData.orderNumber);

    // Get Swychr auth token
    const authToken = await getSwychrAuthToken();
    console.log('Got Swychr auth token');

    // Save order to database first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderData.orderNumber,
        customer_name: orderData.customerInfo.fullName,
        customer_phone: orderData.customerInfo.phone,
        delivery_address: orderData.customerInfo.address,
        notes: orderData.customerInfo.notes,
        items: orderData.items,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        total: orderData.total,
        payment_method: 'swychr',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error saving order:', orderError);
      throw new Error(`Failed to save order: ${orderError.message}`);
    }

    console.log('Order saved to database:', order.id);

    // Create payment link with Swychr
    const paymentResponse = await createPaymentLink(authToken, orderData);
    console.log('Payment link created:', paymentResponse);

    // Update order with payment reference
    if (paymentResponse.data?.payment_url || paymentResponse.payment_url) {
      await supabase
        .from('orders')
        .update({ 
          payment_reference: paymentResponse.data?.payment_url || paymentResponse.payment_url 
        })
        .eq('id', order.id);
    }

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      paymentUrl: paymentResponse.data?.payment_url || paymentResponse.payment_url,
      message: 'Order created and payment link generated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});