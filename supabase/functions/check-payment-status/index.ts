import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to extract session ID from order notes
function extractSessionIdFromNotes(notes: string): string | undefined {
  if (!notes) return undefined;
  const match = notes.match(/Fapshi Session: ([^\s|]+)/);
  return match ? match[1] : undefined;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting payment status check...');

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all orders that need status checking (pending orders with payment references)
    const { data: pendingOrders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_status', 'pending')
      .not('payment_reference', 'is', null);

    if (error) {
      console.error('Error fetching pending orders:', error);
      throw error;
    }

    console.log(`Found ${pendingOrders?.length || 0} orders to check status for`);

    if (!pendingOrders || pendingOrders.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No orders to check status for',
        count: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const results = [];
    
    for (const order of pendingOrders) {
      try {
        console.log(`Checking payment status for order: ${order.order_number}`);
        
        // Call the fapshi-status function to check payment status
        const statusResponse = await supabase.functions.invoke('fapshi-status', {
          body: { 
            reference: order.order_number,
            sessionId: extractSessionIdFromNotes(order.notes)
          }
        });

        if (statusResponse.error) {
          console.error(`Failed to check status for order ${order.order_number}:`, statusResponse.error);
          results.push({
            orderNumber: order.order_number,
            success: false,
            error: statusResponse.error.message
          });
          continue;
        }

        const paymentData = statusResponse.data?.data;
        console.log(`Payment status for ${order.order_number}:`, paymentData?.status);

        // Update order status based on payment result
        if (paymentData?.status === 'success' || paymentData?.status === 'completed' || paymentData?.status === 'paid') {
          // Payment successful - update order and send success notification
          const { error: updateError } = await supabase
            .from('orders')
            .update({ payment_status: 'completed' })
            .eq('id', order.id);

          if (updateError) {
            console.error(`Failed to update order ${order.order_number}:`, updateError);
          } else {
            console.log(`Order ${order.order_number} marked as completed`);

            // Send success notification to admin
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
                  oldStatus: 'pending',
                  newStatus: 'completed',
                  notificationType: 'success'
                }
              });

              if (notificationResponse.error) {
                console.error(`Failed to send success notification for ${order.order_number}:`, notificationResponse.error);
              } else {
                console.log(`Success notification sent for order: ${order.order_number}`);
              }
            } catch (notificationError) {
              console.error(`Error sending success notification for ${order.order_number}:`, notificationError);
            }
          }

          results.push({
            orderNumber: order.order_number,
            success: true,
            status: 'completed',
            message: 'Payment successful - notification sent'
          });

        } else if (paymentData?.status === 'failed' || paymentData?.status === 'cancelled' || paymentData?.status === 'expired') {
          // Payment failed - update order and send failure notification
          const { error: updateError } = await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', order.id);

          if (updateError) {
            console.error(`Failed to update order ${order.order_number}:`, updateError);
          } else {
            console.log(`Order ${order.order_number} marked as failed`);

            // Send failure notification to admin with detailed error logging
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
                  oldStatus: 'pending',
                  newStatus: 'failed',
                  notificationType: 'failed',
                  errorDetails: {
                    paymentStatus: paymentData?.status,
                    paymentMessage: paymentData?.message || 'Payment failed',
                    failureReason: paymentData?.failure_reason || 'Unknown reason',
                    transactionId: order.order_number,
                    timestamp: new Date().toISOString()
                  }
                }
              });

              if (notificationResponse.error) {
                console.error(`Failed to send failure notification for ${order.order_number}:`, notificationResponse.error);
              } else {
                console.log(`Failure notification sent for order: ${order.order_number}`);
              }
            } catch (notificationError) {
              console.error(`Error sending failure notification for ${order.order_number}:`, notificationError);
            }
          }

          results.push({
            orderNumber: order.order_number,
            success: true,
            status: 'failed',
            message: 'Payment failed - admin notified with error details'
          });

        } else {
          // Still pending - no action needed
          console.log(`Order ${order.order_number} still pending`);
          results.push({
            orderNumber: order.order_number,
            success: true,
            status: 'pending',
            message: 'Still pending'
          });
        }

      } catch (orderError) {
        console.error(`Error processing order ${order.order_number}:`, orderError);
        results.push({
          orderNumber: order.order_number,
          success: false,
          error: (orderError as Error)?.message || 'Unknown database error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    const completedCount = results.filter(r => r.status === 'completed').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    console.log(`Status check results: ${successCount} processed, ${failCount} errors, ${completedCount} completed, ${failedCount} failed`);

    return new Response(JSON.stringify({
      success: true,
      message: `Processed ${pendingOrders.length} orders`,
      count: pendingOrders.length,
      results: {
        processed: successCount,
        errors: failCount,
        completed: completedCount,
        failed: failedCount,
        details: results
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in check-payment-status function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error)?.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});