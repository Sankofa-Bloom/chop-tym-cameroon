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
    console.log('Swychr create payment function called at:', new Date().toISOString());
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
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

    const authResponse = await fetch('https://api.accountpe.com/api/payin/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authPayload),
    });

    const authRaw = await authResponse.text();
    let authData: any = {};
    try { authData = authRaw ? JSON.parse(authRaw) : {}; } catch (_e) { authData = { raw: authRaw }; }
    
    // Check for both access_token and token fields
    const accessToken = authData.access_token || authData.token;
    
    if (!authResponse.ok || !accessToken) {
      console.error('Failed to authenticate with Swychr:', authResponse.status, authRaw);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with payment service', status: authResponse.status, details: authData }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    console.log('Got Swychr access token');

    // Create payment link
    const normalizedPhoneRaw = String(customer_phone).replace(/\s+/g, '').replace(/^\+/, '');
    const normalizedPhone = normalizedPhoneRaw.startsWith('237') ? normalizedPhoneRaw.slice(3) : normalizedPhoneRaw;

    const paymentPayload = {
      country_code: 'CM',
      name: customer_name,
      email: customer_email || `${normalizedPhone}@choptym.com`,
      mobile: normalizedPhone,
      amount: parseInt(amount),
      transaction_id: order_id,
      description: description || `Order ${order_id}`,
      pass_digital_charge: true
    };

    console.log('Creating Swychr payment link with payload:', paymentPayload);

    const paymentResponse = await fetch('https://api.accountpe.com/api/payin/create_payment_links', {
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
    if (savedOrderId && paymentData.data) {
      await supabase
        .from('orders')
        .update({ 
          payment_reference: paymentData.data.transaction_id || order_id,
          payment_status: 'pending'
        })
        .eq('id', savedOrderId);
    }

    // Send admin notification email immediately when payment link is created
    if (orderData && paymentData.data?.payment_link) {
      try {
        console.log('Sending admin notification email...');
        const { error: emailError } = await supabase.functions.invoke('send-admin-notification', {
          body: {
            orderData: {
              ...orderData,
              paymentUrl: paymentData.data.payment_link
            }
          }
        });
        
        if (emailError) {
          console.error('Failed to send admin notification:', emailError);
          // Don't fail the payment creation if email fails
        } else {
          console.log('Admin notification sent successfully');
        }
      } catch (error) {
        console.error('Error sending admin notification:', error);
        // Don't fail the payment creation if email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: paymentData.data?.payment_link,
        payment_link_id: paymentData.data?.transaction_id || order_id,
        order_id: savedOrderId,
        data: paymentData.data
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