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
      amount,
      currency = 'XAF',
      orderId,
      userId,
      callbackUrl,
      returnUrl,
      orderData
    } = await req.json();

    console.log('Creating Fapshi payment for:', { orderId, amount, userId });

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

    // Get Fapshi secret key
    const fapshiSecretKey = Deno.env.get('FAPSHI_SECRET_KEY');
    if (!fapshiSecretKey) {
      throw new Error('FAPSHI_SECRET_KEY not configured');
    }

    // Create payment with Fapshi API (using sandbox)
    const fapshiResponse = await fetch('https://sandbox.fapshi.com/api/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fapshiSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency,
        reference: orderRecord?.order_number || orderId,
        callback_url: callbackUrl || `${Deno.env.get('SUPABASE_URL')}/functions/v1/fapshi-webhook`,
        return_url: returnUrl || `${req.headers.get('origin') || 'https://localhost:3000'}/order-confirmation`,
        customer: {
          id: userId || orderRecord?.customer_phone || 'anonymous'
        }
      }),
    });

    let fapshiData: any;
    const responseText = await fapshiResponse.text();
    try {
      fapshiData = JSON.parse(responseText);
    } catch (_) {
      console.error('Non-JSON Fapshi response:', responseText);
      throw new Error('Invalid response from Fapshi API');
    }

    if (fapshiResponse.ok && fapshiData.success && fapshiData.data?.checkout_url) {
      console.log('Fapshi payment created successfully:', fapshiData.data.checkout_url);
      
      // Update order with payment reference if we have an order
      if (orderRecord && orderData) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from('orders')
          .update({ 
            payment_reference: fapshiData.data.checkout_url,
            // Store Fapshi session ID for status checking
            notes: orderRecord.notes + ` | Fapshi Session: ${fapshiData.data.session_id || fapshiData.data.id}`
          })
          .eq('id', orderRecord.id);
      }

      return new Response(JSON.stringify({
        success: true,
        data: {
          paymentLink: fapshiData.data.checkout_url,
          sessionId: fapshiData.data.session_id || fapshiData.data.id,
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

          // Send detailed failure notification to admin
          await supabase.functions.invoke('send-status-notification', {
            body: {
              orderData: {
                orderNumber: orderRecord.order_number,
                customerName: orderRecord.customer_name,
                customerPhone: orderRecord.customer_phone,
                deliveryAddress: orderRecord.delivery_address,
                items: orderRecord.items,
                subtotal: orderRecord.subtotal,
                deliveryFee: orderRecord.delivery_fee,
                total: orderRecord.total,
                paymentReference: null,
                createdAt: orderRecord.created_at,
                notes: orderRecord.notes,
              },
              oldStatus: 'pending',
              newStatus: 'failed',
              notificationType: 'failed',
              errorDetails: {
                stage: 'payment_creation',
                paymentResponse: fapshiData,
                errorMessage: 'Failed to create Fapshi payment',
                timestamp: new Date().toISOString(),
                requestData: {
                  amount,
                  currency,
                  reference: orderRecord.order_number,
                }
              }
            }
          });

          console.log('Admin failure notification sent for failed Fapshi payment creation');
        } catch (notificationError) {
          console.error('Failed to send admin notification for Fapshi payment creation failure:', notificationError);
        }
      }

      return new Response(JSON.stringify({
        error: 'Fapshi payment creation failed',
        details: fapshiData,
        errorCode: 'PAYMENT_CREATION_FAILED',
        timestamp: new Date().toISOString()
      }), {
        status: 400,
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