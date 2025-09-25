import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'https://esm.sh/react@18.3.1';
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { OrderConfirmationEmail } from './_templates/order-confirmation.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  console.log('Order confirmation email function called');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData, customerEmail } = await req.json();
    console.log('Sending order confirmation to:', customerEmail);

    // Render the React email template
    const html = await renderAsync(
      React.createElement(OrderConfirmationEmail, {
        orderNumber: orderData.order_number,
        customerName: orderData.customer_name,
        customerPhone: orderData.customer_phone,
        deliveryAddress: orderData.delivery_address,
        items: orderData.items,
        subtotal: orderData.subtotal,
        deliveryFee: orderData.delivery_fee,
        total: orderData.total,
        notes: orderData.notes,
        estimatedDelivery: '30-45 minutes',
      })
    );

    // Configure SMTP client for Zoho
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get('ZOHO_SMTP_HOST') || 'smtp.zoho.com',
        port: parseInt(Deno.env.get('ZOHO_SMTP_PORT') || '587'),
        tls: true,
        auth: {
          username: Deno.env.get('ZOHO_SMTP_USERNAME')!,
          password: Deno.env.get('ZOHO_SMTP_PASSWORD')!,
        },
      },
    });

    // Send the email
    await client.send({
      from: `ChopTym <support@choptym.com>`,
      to: customerEmail,
      subject: `Order Confirmed #${orderData.order_number} - ChopTym`,
      html: html,
    });

    console.log('Order confirmation email sent successfully to:', customerEmail);

    return new Response(
      JSON.stringify({ success: true, message: 'Order confirmation email sent successfully' }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error in send-order-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: (error as Error)?.message || 'Unknown error occurred' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});