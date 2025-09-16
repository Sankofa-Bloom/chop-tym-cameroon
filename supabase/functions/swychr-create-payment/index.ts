import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  // Handle CORS preflight requests  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('Swychr payment request received:', requestData, new Date().toISOString());

    const {
      amount,
      customer_phone,
      customer_name,
      customer_email,
      order_id,
      description,
      orderData
    } = requestData;

    // Validate required fields
    if (!amount || !customer_phone || !customer_name || !order_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Save order to database if provided
    let savedOrderId = null;
    if (orderData) {
      console.log('Saving order to database...');
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        console.error('Error saving order (continuing without DB save):', orderError);
        // Don't fail the whole payment flow if order save fails
      } else if (orderResult) {
        savedOrderId = orderResult.id;
        console.log('Order saved with ID:', savedOrderId);
      }
    }

    // Get Swychr access token
    const swychrEmail = Deno.env.get('SWYCHR_API_EMAIL');
    const swychrPassword = Deno.env.get('SWYCHR_API_PASSWORD');
    
    if (!swychrEmail || !swychrPassword) {
      console.error('Missing Swychr credentials');
      return new Response(
        JSON.stringify({ error: 'Payment service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Authenticate with Swychr directly
    const authPayload = {
      email: swychrEmail,
      password: swychrPassword
    };

    const authResponse = await fetch('https://api.accountpe.com/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authPayload),
    });

    const authRaw = await authResponse.text();
    let authData: any = {};
    try { authData = authRaw ? JSON.parse(authRaw) : {}; } catch (_e) { authData = { raw: authRaw }; }
    
    if (!authResponse.ok || !authData.access_token) {
      console.error('Failed to authenticate with Swychr:', authResponse.status, authRaw);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with payment service', status: authResponse.status, details: authData }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const accessToken = authData.access_token;
    console.log('Got Swychr access token');

    // Create payment link
    const normalizedPhoneRaw = String(customer_phone).replace(/\s+/g, '').replace(/^\+/, '');
    const normalizedPhone = normalizedPhoneRaw.startsWith('237') ? normalizedPhoneRaw.slice(3) : normalizedPhoneRaw;

    const paymentPayload = {
      amount: parseFloat(amount),
      currency: 'XAF',
      country_code: 'CM',
      customer_phone: normalizedPhone,
      customer_name,
      customer_email: customer_email || `${normalizedPhone}@choptym.com`,
      pass_digital_charge: true,
      payment_reference: order_id,
      description: description || `Order ${order_id}`,
      redirect_url: `${Deno.env.get('APP_BASE_URL')}/order-confirmation?payment=success&reference=${order_id}`,
      cancel_url: `${Deno.env.get('APP_BASE_URL')}/order-confirmation?payment=cancelled&reference=${order_id}`,
      webhook_url: `${supabaseUrl}/functions/v1/swychr-webhook`
    };

    console.log('Creating Swychr payment link with payload:', paymentPayload);

    const paymentResponse = await fetch('https://api.accountpe.com/create_payment_links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const paymentRaw = await paymentResponse.text();
    let paymentData: any = {};
    try { paymentData = paymentRaw ? JSON.parse(paymentRaw) : {}; } catch (_e) { paymentData = { raw: paymentRaw }; }
    console.log('Swychr payment response:', paymentData);

    if (!paymentResponse.ok) {
      console.error('Swychr payment creation failed:', paymentResponse.status, paymentRaw);
      
      // Update order status to failed if order was saved
      if (savedOrderId) {
        await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('id', savedOrderId);
      }

      return new Response(
        JSON.stringify({ 
          error: 'Payment creation failed', 
          status: paymentResponse.status,
          details: paymentData 
        }),
        { 
          status: paymentResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update order with payment reference if order was saved
    if (savedOrderId && paymentData.payment_link_id) {
      await supabase
        .from('orders')
        .update({ 
          payment_reference: paymentData.payment_link_id,
          payment_status: 'pending'
        })
        .eq('id', savedOrderId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: paymentData.payment_url,
        payment_link_id: paymentData.payment_link_id,
        order_id: savedOrderId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in swychr-create-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});