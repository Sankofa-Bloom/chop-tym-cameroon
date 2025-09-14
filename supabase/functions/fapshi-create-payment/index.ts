import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
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
      amount,
      currency = 'XAF',
      orderId,
      userId,
      callbackUrl,
      returnUrl,
      orderData
    } = await req.json();

    console.log('Incoming request body:', { orderId, amount, userId, orderData: !!orderData });

    // Save order to database first if orderData is provided
    let orderRecord: any = null;
    if (orderData) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customerInfo?.fullName || '',
          customer_phone: orderData.customerInfo?.phone || '',
          delivery_address: orderData.customerInfo?.address || '',
          town: orderData.customerInfo?.town || 'Douala',
          items: orderData.items || [],
          subtotal: orderData.subtotal || amount,
          delivery_fee: orderData.deliveryFee || 0,
          total: amount,
          payment_method: 'fapshi',
          payment_status: 'pending',
          notes: orderData.customerInfo?.notes || ''
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving order:', error);
        throw new Error('Failed to save order');
      }

      orderRecord = order;
      console.log('Order saved to database:', order.id);
    }

    // Get Fapshi sandbox key
    const fapshiSandboxKey = Deno.env.get('FAPSHI_SANDBOX_KEY');
    if (!fapshiSandboxKey) {
      throw new Error('FAPSHI_SANDBOX_KEY not configured');
    }

    // Format phone number for Fapshi (ensure 237 prefix)
    let phoneNumber = orderData?.customerInfo?.phone || '';
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '237' + phoneNumber.substring(1);
    } else if (phoneNumber.startsWith('+237')) {
      phoneNumber = phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('237')) {
      phoneNumber = '237' + phoneNumber;
    }

    // Detect network based on phone number prefix
    const network = phoneNumber.startsWith('2376') ? 'MTN' : 'ORANGE';

    // Validate required fields
    const requiredFields = ['amount', 'currency', 'phone_number', 'network', 'transaction_id'];
    const fieldValues = {
      amount,
      currency,
      phone_number: phoneNumber,
      network,
      transaction_id: orderRecord?.order_number || orderId
    };

    for (const field of requiredFields) {
      if (!fieldValues[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Build Fapshi payload
    const fapshiPayload = {
      amount: amount,
      currency: currency,
      phone_number: phoneNumber,
      network: network,
      merchant_key: fapshiSandboxKey,
      transaction_id: orderRecord?.order_number || orderId,
      description: `ChopTym order #${orderRecord?.order_number || orderId}`,
      callback_url: callbackUrl || 'https://qiupqrmtxwtgipbwcvoo.supabase.co/functions/v1/fapshi-webhook',
      return_url: returnUrl || `${req.headers.get('origin') || 'https://localhost:3000'}/order-confirmation`
    };

    console.log('Outgoing payload to Fapshi:', fapshiPayload);

    // Call Fapshi sandbox API
    const fapshiResponse = await fetch('https://sandbox.fapshi.com/merchantpay/momo/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fapshiPayload)
    });

    const fapshiRaw = await fapshiResponse.text();
    let fapshiData: any;
    try {
      fapshiData = fapshiRaw ? JSON.parse(fapshiRaw) : { message: 'Empty response body' };
    } catch (e) {
      fapshiData = { raw: fapshiRaw };
    }
    console.log('Fapshi response (raw):', fapshiRaw);
    console.log('Fapshi response (parsed):', fapshiData);

    if (fapshiResponse.ok) {
      console.log('Fapshi payment created successfully:', fapshiData);
      
      // Update order with payment reference if we have an order
      if (orderRecord && orderData) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from('orders')
          .update({ 
            payment_reference: fapshiData.payment_link || fapshiData.link || JSON.stringify(fapshiData),
            notes: orderRecord.notes + ` | Fapshi Response: ${JSON.stringify(fapshiData)}`
          })
          .eq('id', orderRecord.id);
      }

      return new Response(JSON.stringify({
        success: true,
        data: {
          ...fapshiData,
          orderId: orderRecord?.order_number || orderId
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('Fapshi payment creation failed:', fapshiData);
      
      // Send admin failure notification with detailed error logging
      if (orderRecord && orderData) {
        try {
          const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
          const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
          const supabase = createClient(supabaseUrl, supabaseKey);

          // Update order status to failed
          await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', orderRecord.id);

          console.log('Order marked as failed due to Fapshi payment creation failure');
        } catch (notificationError) {
          console.error('Failed to update order status:', notificationError);
        }
      }

      return new Response(JSON.stringify({
        error: 'Fapshi payment creation failed',
        details: fapshiData,
        status: fapshiResponse.status,
        timestamp: new Date().toISOString()
      }), {
        status: fapshiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in fapshi-create-payment function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});