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
    console.log('Offline payment request received:', requestData, new Date().toISOString());

    const { orderData } = requestData;

    // Validate required fields
    if (!orderData || !orderData.order_number || !orderData.customer_name || !orderData.customer_phone) {
      return new Response(
        JSON.stringify({ error: 'Missing required order data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Save order to database
    let savedOrderId = null;
    console.log('Saving offline order to database...');
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert([{
        ...orderData,
        payment_status: 'pending',
        payment_method: 'offline'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error saving offline order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to save order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else if (orderResult) {
      savedOrderId = orderResult.id;
      console.log('Offline order saved with ID:', savedOrderId);
    }

    // Send admin notification email immediately using both services for redundancy
    try {
      console.log('Sending admin notification for offline payment...');
      
      // Try Resend first (more reliable)
      const { error: resendError } = await supabase.functions.invoke('send-admin-notification-resend', {
        body: {
          orderData: {
            orderNumber: orderData.order_number,
            customerInfo: {
              fullName: orderData.customer_name,
              phone: orderData.customer_phone,
              address: orderData.delivery_address,
              notes: orderData.notes
            },
            items: orderData.items,
            subtotal: orderData.subtotal,
            deliveryFee: orderData.delivery_fee,
            total: orderData.total,
            paymentUrl: null, // No payment URL for offline payments
            paymentMethod: 'offline'
          }
        }
      });
      
      if (resendError) {
        console.error('Resend notification failed, trying Zoho backup:', resendError);
        
        // Fallback to Zoho SMTP
        const { error: zohoError } = await supabase.functions.invoke('send-admin-notification', {
          body: {
            orderData: {
              orderNumber: orderData.order_number,
              customerInfo: {
                fullName: orderData.customer_name,
                phone: orderData.customer_phone,
                address: orderData.delivery_address,
                notes: orderData.notes
              },
              items: orderData.items,
              subtotal: orderData.subtotal,
              deliveryFee: orderData.delivery_fee,
              total: orderData.total,
              paymentUrl: null,
              paymentMethod: 'offline'
            }
          }
        });
        
        if (zohoError) {
          console.error('Both notification services failed:', zohoError);
        } else {
          console.log('Admin notification sent via Zoho backup');
        }
      } else {
        console.log('Admin notification sent via Resend successfully');
      }
      
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't fail the order creation if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: savedOrderId,
        message: 'Offline order created successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in offline-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});