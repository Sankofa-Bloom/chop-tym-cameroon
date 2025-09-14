import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    console.log('Received Fapshi webhook:', JSON.stringify(webhookData, null, 2));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract payment information from webhook
    const paymentData = webhookData.data || webhookData;
    const reference = paymentData.reference;
    const status = paymentData.status;
    const sessionId = paymentData.session_id || paymentData.id;

    if (!reference) {
      console.error('No reference found in webhook data');
      return new Response(JSON.stringify({ error: 'No reference found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing webhook for reference: ${reference}, status: ${status}`);

    // Find the order by order_number (which should match the reference)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', reference)
      .single();

    if (orderError || !order) {
      console.error('Order not found for reference:', reference, orderError);
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update order status based on payment result
    let newStatus = 'pending';
    let notificationType = 'status_update';

    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        newStatus = 'completed';
        notificationType = 'success';
        break;
      case 'failed':
      case 'cancelled':
      case 'expired':
        newStatus = 'failed';
        notificationType = 'failed';
        break;
      default:
        newStatus = 'pending';
        break;
    }

    // Update order in database
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        payment_status: newStatus,
        notes: order.notes + ` | Fapshi Webhook: ${status} at ${new Date().toISOString()}`
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      throw new Error('Failed to update order status');
    }

    console.log(`Order ${reference} updated to status: ${newStatus}`);

    // Send notification to admin for successful or failed payments
    if (newStatus === 'completed' || newStatus === 'failed') {
      try {
        const notificationResponse = await supabase.functions.invoke('send-status-notification', {
          body: {
            orderData: {
              orderNumber: order.order_number,
              customerName: order.customer_name,
              customerPhone: order.customer_phone,
              deliveryAddress: order.delivery_address,
              items: order.items,
              subtotal: order.subtotal,
              deliveryFee: order.delivery_fee,
              total: order.total,
              paymentReference: order.payment_reference,
              createdAt: order.created_at,
              notes: order.notes,
            },
            oldStatus: order.payment_status,
            newStatus: newStatus,
            notificationType: notificationType,
            webhookData: paymentData
          }
        });

        if (notificationResponse.error) {
          console.error(`Failed to send ${notificationType} notification:`, notificationResponse.error);
        } else {
          console.log(`${notificationType} notification sent for order: ${reference}`);
        }
      } catch (notificationError) {
        console.error(`Error sending ${notificationType} notification:`, notificationError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook processed successfully',
      orderNumber: reference,
      newStatus: newStatus
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing Fapshi webhook:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});