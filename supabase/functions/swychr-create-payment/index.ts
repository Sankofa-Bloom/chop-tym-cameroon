import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      country_code,
      name,
      email,
      mobile,
      amount,
      transaction_id,
      description,
      pass_digital_charge = true,
      orderData
    } = await req.json();

    console.log('Creating payment for:', { transaction_id, amount, name });

    // First get authentication token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const authResponse = await fetch(`${supabaseUrl}/functions/v1/swychr-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with Swychr');
    }

    const authData = await authResponse.json();
    const token = authData.token;

    // Save order to database first if orderData is provided
    let orderId = null;
    if (orderData) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          order_number: transaction_id,
          customer_name: name,
          customer_phone: mobile,
          delivery_address: orderData.customerInfo?.address || '',
          town: orderData.customerInfo?.town || 'Douala',
          items: orderData.items || [],
          subtotal: orderData.subtotal || amount,
          delivery_fee: orderData.deliveryFee || 0,
          total: amount,
          payment_method: 'swychr',
          payment_status: 'pending',
          notes: orderData.customerInfo?.notes || ''
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving order:', error);
        throw new Error('Failed to save order');
      }

      orderId = order.id;
      console.log('Order saved to database:', orderId);
    }

    // Create payment link
    const paymentResponse = await fetch('https://api.swychrconnect.com/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        country_code,
        name,
        email,
        mobile,
        amount,
        transaction_id,
        description,
        pass_digital_charge,
      }),
    });

    const paymentData = await paymentResponse.json();

    if (paymentResponse.ok && paymentData.data?.payment_link) {
      console.log('Payment link created successfully:', paymentData.data.payment_link);
      
      // Update order with payment reference if we have an order
      if (orderId && orderData) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from('orders')
          .update({ payment_reference: paymentData.data.payment_link })
          .eq('id', orderId);
      }

      return new Response(JSON.stringify({
        success: true,
        data: paymentData.data,
        orderId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('Payment creation failed:', paymentData);
      return new Response(JSON.stringify({
        error: 'Payment creation failed',
        details: paymentData
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in swychr-create-payment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});