import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'https://esm.sh/react@18.3.1';
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
// Resend removed - using Zoho SMTP only
import { OrderNotificationEmail } from './_templates/order-notification.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData } = await req.json();
    console.log('send-admin-order-placed called for order:', orderData?.orderNumber || orderData?.order_number);

    // Normalize order fields
    const orderNumber = orderData.orderNumber || orderData.order_number;
    const customerName = orderData.customerInfo?.fullName || orderData.customer_name;
    const customerPhone = orderData.customerInfo?.phone || orderData.customer_phone;
    const deliveryAddress = orderData.customerInfo?.address || orderData.delivery_address;
    const notes = orderData.customerInfo?.notes || orderData.notes;

    const html = await renderAsync(
      React.createElement(OrderNotificationEmail, {
        orderNumber,
        customerName,
        customerPhone,
        deliveryAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee || orderData.delivery_fee,
        total: orderData.total,
        notes,
        paymentUrl: orderData.paymentUrl,
      })
    );

    // Send via Zoho SMTP only
    const smtpPort = parseInt(Deno.env.get('ZOHO_SMTP_PORT') || '587');
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get('ZOHO_SMTP_HOST') || 'smtp.zoho.com',
        port: smtpPort,
        tls: smtpPort === 465,
        auth: {
          username: Deno.env.get('ZOHO_SMTP_USERNAME')!,
          password: Deno.env.get('ZOHO_SMTP_PASSWORD')!,
        },
      },
    });

    await client.send({
      from: `ChopTym <support@choptym.com>`,
      to: 'choptym237@gmail.com',
      subject: `🆕 New Order Placed: ${orderNumber} - ${customerName}`,
      html,
    });
    console.log('Order placed admin email sent via Zoho SMTP');

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-admin-order-placed:', error);
    return new Response(
      JSON.stringify({ error: (error as any)?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
