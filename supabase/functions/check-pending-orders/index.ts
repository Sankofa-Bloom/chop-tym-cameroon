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
    console.log('Starting check for long-pending orders...');

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find orders that have been pending for more than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: longPendingOrders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_status', 'pending')
      .lt('created_at', twentyFourHoursAgo);

    if (error) {
      console.error('Error fetching long-pending orders:', error);
      throw error;
    }

    console.log(`Found ${longPendingOrders?.length || 0} orders pending for more than 24 hours`);

    if (!longPendingOrders || longPendingOrders.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No long-pending orders found',
        count: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Send notifications for each long-pending order
    const notifications = [];
    
    for (const order of longPendingOrders) {
      try {
        console.log(`Sending pending notification for order: ${order.order_number}`);
        
        // Call the status notification function
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
            oldStatus: 'pending',
            newStatus: 'pending',
            notificationType: 'pending_long'
          }
        });

        if (notificationResponse.error) {
          console.error(`Failed to send notification for order ${order.order_number}:`, notificationResponse.error);
          notifications.push({
            orderNumber: order.order_number,
            success: false,
            error: notificationResponse.error.message
          });
        } else {
          console.log(`Notification sent successfully for order: ${order.order_number}`);
          notifications.push({
            orderNumber: order.order_number,
            success: true
          });
        }
      } catch (notificationError) {
        console.error(`Error sending notification for order ${order.order_number}:`, notificationError);
        notifications.push({
          orderNumber: order.order_number,
          success: false,
          error: notificationError.message
        });
      }
    }

    const successCount = notifications.filter(n => n.success).length;
    const failCount = notifications.filter(n => !n.success).length;

    console.log(`Notification results: ${successCount} sent, ${failCount} failed`);

    return new Response(JSON.stringify({
      success: true,
      message: `Processed ${longPendingOrders.length} long-pending orders`,
      count: longPendingOrders.length,
      notifications: {
        sent: successCount,
        failed: failCount,
        details: notifications
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in check-pending-orders function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});