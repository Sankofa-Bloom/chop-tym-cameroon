import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const webhookData = await req.json();
    console.log('Swychr webhook received:', webhookData, 'at', new Date().toISOString());

    const {
      payment_link_id,
      payment_reference,
      status,
      amount,
      currency,
      paid_at,
      customer_phone,
      customer_name
    } = webhookData;

    if (!payment_reference) {
      console.error('No payment reference in webhook data');
      return new Response(
        JSON.stringify({ error: 'No payment reference provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Find the order by payment reference or order number
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .or(`payment_reference.eq.${payment_link_id},order_number.eq.${payment_reference}`)
      .limit(1);

    if (orderError) {
      console.error('Error finding order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!orders || orders.length === 0) {
      console.log('No order found for payment reference:', payment_reference);
      return new Response(
        JSON.stringify({ message: 'Order not found', payment_reference }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const order = orders[0];
    console.log('Found order:', order.id);

    // Map Swychr status to our status
    let orderStatus = 'pending';
    if (status === 'paid' || status === 'completed') {
      orderStatus = 'paid';
    } else if (status === 'failed' || status === 'cancelled') {
      orderStatus = 'failed';
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: orderStatus,
        payment_reference: payment_link_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Order ${order.id} updated to status: ${orderStatus}`);

    // Send confirmation email if payment is successful
    if (orderStatus === 'paid') {
      try {
        await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId: order.id,
            customerEmail: order.customer_email || `${customer_phone}@choptym.com`,
            customerName: order.customer_name,
            orderNumber: order.order_number,
            items: order.items,
            total: order.total,
            paymentMethod: 'swychr'
          }
        });
        console.log('Order confirmation email sent');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        order_id: order.id,
        status: orderStatus 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in swychr-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});