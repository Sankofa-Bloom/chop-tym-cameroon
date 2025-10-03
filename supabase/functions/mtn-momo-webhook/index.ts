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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    console.log('MTN MoMo webhook received:', webhookData, 'at', new Date().toISOString());

    const {
      referenceId,
      externalId,
      status,
      amount,
      currency,
      payer
    } = webhookData;

    if (!externalId) {
      console.error('No external ID (order number) in webhook data');
      return new Response(
        JSON.stringify({ error: 'No order reference provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the order by order number or payment reference
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .or(`payment_reference.eq.${referenceId},order_number.eq.${externalId}`)
      .limit(1);

    if (orderError) {
      console.error('Error finding order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!orders || orders.length === 0) {
      console.log('No order found for reference:', externalId);
      return new Response(
        JSON.stringify({ message: 'Order not found', reference: externalId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const order = orders[0];
    console.log('Found order:', order.id);

    // Map MTN status to our status
    let orderStatus = 'pending';
    if (status === 'SUCCESSFUL') {
      orderStatus = 'paid';
    } else if (status === 'FAILED') {
      orderStatus = 'failed';
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: orderStatus,
        payment_reference: referenceId,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Order ${order.id} updated to status: ${orderStatus}`);

    // Send notifications if payment is successful
    if (orderStatus === 'paid') {
      // Send admin notification
      try {
        console.log('Sending admin notification for MTN MoMo payment...');
        await supabase.functions.invoke('send-admin-notification', {
          body: {
            orderData: {
              orderNumber: order.order_number,
              customerInfo: {
                fullName: order.customer_name,
                phone: order.customer_phone || payer?.partyId,
                address: order.delivery_address || 'N/A',
                notes: order.notes || 'Payment via MTN Mobile Money'
              },
              items: order.items || [],
              subtotal: order.subtotal || order.total,
              deliveryFee: order.delivery_fee || 0,
              total: order.total,
              paymentUrl: null,
              paymentMethod: 'mtn_momo',
              paymentStatus: 'paid'
            }
          }
        });
        console.log('Admin notification sent for MTN MoMo payment');
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }

      // Send customer confirmation email
      try {
        await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId: order.id,
            customerEmail: order.customer_email,
            customerName: order.customer_name,
            orderNumber: order.order_number,
            items: order.items,
            total: order.total,
            paymentMethod: 'mtn_momo'
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
    console.error('Error in mtn-momo-webhook function:', error);
    return new Response(
      JSON.stringify({ error: (error as Error)?.message || 'Unknown error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
