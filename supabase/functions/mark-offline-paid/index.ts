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
    const { order_id } = await req.json();
    console.log('mark-offline-paid called for order:', order_id, 'at', new Date().toISOString());

    if (!order_id) {
      return new Response(
        JSON.stringify({ success: false, message: 'order_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Fetch order to validate
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, payment_status, payment_method, customer_name, order_number, items, total')
      .eq('id', order_id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching order:', fetchError);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to fetch order' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (!order) {
      return new Response(
        JSON.stringify({ success: false, message: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (order.payment_status === 'paid') {
      console.log('Order already marked as paid:', order_id);
      return new Response(
        JSON.stringify({ success: true, message: 'Order already paid' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Only allow marking offline orders as paid (optional safeguard)
    if (order.payment_method !== 'offline') {
      console.warn('Attempt to mark non-offline order as paid:', order_id, order.payment_method);
    }

    // Update order status to paid
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', order_id);

    if (updateError) {
      console.error('Error updating order status:', updateError);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to update order status' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Try sending confirmation; don't fail if email fails
    try {
      await supabase.functions.invoke('send-order-confirmation', {
        body: {
          order_id: order_id,
          customer_email: null,
        },
      });
      console.log('send-order-confirmation invoked for order:', order_id);
    } catch (emailError) {
      console.error('send-order-confirmation failed (non-blocking):', emailError);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Order marked as paid' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error in mark-offline-paid function:', error);
    return new Response(
      JSON.stringify({ success: false, message: (error as Error)?.message || 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});