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

// Rate limiting: Track IPs and phone numbers
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_HOUR = 10; // Max 10 orders per hour per IP/phone

function checkRateLimit(key: string): { allowed: boolean, message?: string } {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (record.count >= MAX_REQUESTS_PER_HOUR) {
    const minutesUntilReset = Math.ceil((record.resetTime - now) / 60000);
    return { 
      allowed: false, 
      message: `Rate limit exceeded. Please try again in ${minutesUntilReset} minutes.` 
    };
  }
  
  record.count++;
  return { allowed: true };
}

// Input validation
function validateOrderData(orderData: any): { valid: boolean, error?: string } {
  // Validate customer name
  if (!orderData.customer_name || typeof orderData.customer_name !== 'string') {
    return { valid: false, error: 'Invalid customer name' };
  }
  if (orderData.customer_name.length > 100 || orderData.customer_name.length < 2) {
    return { valid: false, error: 'Customer name must be between 2 and 100 characters' };
  }
  
  // Validate phone number
  if (!orderData.customer_phone || typeof orderData.customer_phone !== 'string') {
    return { valid: false, error: 'Invalid phone number' };
  }
  // Cameroon phone format: +237 followed by 9 digits
  const phoneRegex = /^\+237[2-9]\d{8}$/;
  if (!phoneRegex.test(orderData.customer_phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Invalid phone format. Use: +237 6XX XXX XXX' };
  }
  
  // Validate delivery address
  if (!orderData.delivery_address || typeof orderData.delivery_address !== 'string') {
    return { valid: false, error: 'Invalid delivery address' };
  }
  if (orderData.delivery_address.length > 500 || orderData.delivery_address.length < 10) {
    return { valid: false, error: 'Delivery address must be between 10 and 500 characters' };
  }
  
  // Validate amounts
  if (typeof orderData.total !== 'number' || orderData.total <= 0 || orderData.total > 10000000) {
    return { valid: false, error: 'Invalid order total' };
  }
  if (typeof orderData.subtotal !== 'number' || orderData.subtotal <= 0) {
    return { valid: false, error: 'Invalid subtotal' };
  }
  if (typeof orderData.delivery_fee !== 'number' || orderData.delivery_fee < 0) {
    return { valid: false, error: 'Invalid delivery fee' };
  }
  
  // Validate items array
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    return { valid: false, error: 'Order must contain at least one item' };
  }
  if (orderData.items.length > 50) {
    return { valid: false, error: 'Too many items in order' };
  }
  
  // Validate notes length if present
  if (orderData.notes && (typeof orderData.notes !== 'string' || orderData.notes.length > 1000)) {
    return { valid: false, error: 'Notes must be less than 1000 characters' };
  }
  
  return { valid: true };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Offline payment function called at:', new Date().toISOString());
    
    const requestData = await req.json();
    const { orderData } = requestData;

    // Basic validation
    if (!orderData || !orderData.order_number || !orderData.customer_name || !orderData.customer_phone) {
      return new Response(
        JSON.stringify({ error: 'Missing required order data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Input validation
    const validation = validateOrderData(orderData);
    if (!validation.valid) {
      console.warn('Order validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Rate limiting by IP address
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const ipRateLimit = checkRateLimit(`ip:${clientIP}`);
    if (!ipRateLimit.allowed) {
      console.warn('Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ error: ipRateLimit.message }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Rate limiting by phone number
    const normalizedPhone = orderData.customer_phone.replace(/\s/g, '');
    const phoneRateLimit = checkRateLimit(`phone:${normalizedPhone}`);
    if (!phoneRateLimit.allowed) {
      console.warn('Rate limit exceeded for phone:', normalizedPhone);
      return new Response(
        JSON.stringify({ error: phoneRateLimit.message }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Rate limits passed. Saving order...');
    
    // Remove fields that don't exist in the orders table
    const { created_timestamp, normalized_phone, total_formatted, ...cleanOrderData } = orderData;
    
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert([{
        ...cleanOrderData,
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
    }

    console.log('Offline order saved with ID:', orderResult.id);

    // Send admin notification email immediately using Zoho only
    try {
      console.log('Sending admin notification for offline payment via Zoho...');
      
      const { error: zohoError } = await supabase.functions.invoke('send-admin-order-placed', {
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
        console.error('Zoho notification failed:', zohoError);
      } else {
        console.log('Admin notification sent via Zoho SMTP successfully');
      }
      
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't fail the order creation if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: orderResult.id,
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
      JSON.stringify({ error: (error as Error)?.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});