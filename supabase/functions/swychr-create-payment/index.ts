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
    console.log('Calling swychr-auth function at:', `${supabaseUrl}/functions/v1/swychr-auth`);
    
    const authResponse = await fetch(`${supabaseUrl}/functions/v1/swychr-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Auth response status:', authResponse.status);
    
    if (!authResponse.ok) {
      const authError = await authResponse.text();
      console.error('Auth failed:', authError);
      throw new Error(`Failed to authenticate with Swychr: ${authError}`);
    }

    const authData = await authResponse.json();
    console.log('Auth successful, got token');
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
    const paymentResponse = await fetch('https://api.accountpe.com/api/payin/create_payment_links', {
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

    let paymentData: any;
    const text = await paymentResponse.text();
    try {
      paymentData = JSON.parse(text);
    } catch (_) {
      console.error('Non-JSON payment response:', text);
      throw new Error('Invalid response from payment provider');
    }

    const paymentUrl = paymentData.data?.payment_url || paymentData.data?.payment_link || paymentData.payment_url || paymentData.payment_link;

    if (paymentResponse.ok && paymentUrl) {
      console.log('Payment link created successfully:', paymentUrl);
      
      // Update order with payment reference if we have an order
      if (orderId && orderData) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from('orders')
          .update({ payment_reference: paymentUrl })
          .eq('id', orderId);
      }

      return new Response(JSON.stringify({
        success: true,
        data: { payment_link: paymentUrl },
        orderId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('Payment creation failed:', paymentData);
      
      // Send admin failure notification with detailed error logging
      if (orderId && orderData) {
        try {
          const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
          const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
          const supabase = createClient(supabaseUrl, supabaseKey);

          // Update order status to failed
          await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', orderId);

          // Send detailed failure notification to admin
          await supabase.functions.invoke('send-status-notification', {
            body: {
              orderData: {
                orderNumber: transaction_id,
                customerName: name,
                customerPhone: mobile,
                deliveryAddress: orderData.customerInfo?.address || '',
                items: orderData.items || [],
                subtotal: orderData.subtotal || amount,
                deliveryFee: orderData.deliveryFee || 0,
                total: amount,
                paymentReference: null,
                createdAt: new Date().toISOString(),
                notes: orderData.customerInfo?.notes || '',
              },
              oldStatus: 'pending',
              newStatus: 'failed',
              notificationType: 'failed',
              errorDetails: {
                stage: 'payment_creation',
                paymentResponse: paymentData,
                errorMessage: 'Failed to create payment link',
                transactionId: transaction_id,
                timestamp: new Date().toISOString(),
                requestData: {
                  country_code,
                  name,
                  email,
                  mobile,
                  amount,
                  transaction_id,
                  description,
                  pass_digital_charge
                }
              }
            }
          });

          console.log('Admin failure notification sent for failed payment creation');
        } catch (notificationError) {
          console.error('Failed to send admin notification for payment creation failure:', notificationError);
        }
      }

      return new Response(JSON.stringify({
        error: 'Payment creation failed',
        details: paymentData,
        errorCode: 'PAYMENT_CREATION_FAILED',
        timestamp: new Date().toISOString()
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