import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Rate limiting: track requests per IP/phone
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // Max 5 requests per minute

function checkRateLimit(key: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, message: "Too many requests. Please wait before trying again." };
  }

  entry.count++;
  return { allowed: true };
}

function validateOrderData(orderData: any): { valid: boolean; error?: string } {
  if (!orderData) return { valid: false, error: "Order data is required" };

  // Validate customer info
  if (!orderData.customer_name || orderData.customer_name.trim().length < 2) {
    return { valid: false, error: "Valid customer name is required" };
  }

  if (!orderData.customer_phone || !/^\+?237[0-9]{9}$/.test(orderData.customer_phone.replace(/\s/g, ''))) {
    return { valid: false, error: "Valid Cameroon phone number is required" };
  }

  if (!orderData.delivery_address || orderData.delivery_address.trim().length < 5) {
    return { valid: false, error: "Valid delivery address is required" };
  }

  // Validate amounts
  if (typeof orderData.subtotal !== 'number' || orderData.subtotal < 0) {
    return { valid: false, error: "Valid subtotal is required" };
  }

  if (typeof orderData.delivery_fee !== 'number' || orderData.delivery_fee < 0) {
    return { valid: false, error: "Valid delivery fee is required" };
  }

  if (typeof orderData.total !== 'number' || orderData.total <= 0) {
    return { valid: false, error: "Valid total amount is required" };
  }

  // Validate items
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    return { valid: false, error: "At least one item is required" };
  }

  return { valid: true };
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const requestData = await req.json();
    
    console.log("Received delivery order request:", JSON.stringify(requestData, null, 2));

    // Extract order data
    const orderData = requestData.orderData;
    
    // Validate order data
    const validation = validateOrderData(orderData);
    if (!validation.valid) {
      console.error("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limiting by phone
    const phoneKey = `phone:${orderData.customer_phone}`;
    const phoneRateLimit = checkRateLimit(phoneKey);
    if (!phoneRateLimit.allowed) {
      console.warn("Rate limit exceeded for phone:", orderData.customer_phone);
      return new Response(
        JSON.stringify({ success: false, error: phoneRateLimit.message }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Insert order with payment_on_delivery status
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderData.order_number,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        delivery_address: orderData.delivery_address,
        town: orderData.town || "Douala",
        items: orderData.items,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.delivery_fee,
        total: orderData.total,
        notes: orderData.notes || null,
        payment_method: "delivery",
        payment_status: "pending_delivery",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error inserting order:", orderError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create order" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Order created successfully:", order.id);

    // Send admin notification (non-blocking)
    try {
      await supabase.functions.invoke("send-admin-order-placed", {
        body: {
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          deliveryAddress: order.delivery_address,
          town: order.town,
          items: order.items,
          subtotal: order.subtotal,
          deliveryFee: order.delivery_fee,
          total: order.total,
          notes: order.notes,
          paymentMethod: "Payment on Delivery",
          paymentStatus: "Pending (Pay on Delivery)"
        }
      });
      console.log("Admin notification sent");
    } catch (notifyError) {
      console.error("Failed to send admin notification (non-blocking):", notifyError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        order_number: order.order_number,
        message: "Order placed successfully. Payment will be collected on delivery."
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
