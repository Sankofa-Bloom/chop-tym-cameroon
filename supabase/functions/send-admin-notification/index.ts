import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'https://esm.sh/react@18.3.1';
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
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
    console.log('Sending admin notification (Zoho SMTP) for order:', orderData.orderNumber);

    // Render the React email template
    const html = await renderAsync(
      React.createElement(OrderNotificationEmail, {
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerInfo.fullName,
        customerPhone: orderData.customerInfo.phone,
        deliveryAddress: orderData.customerInfo.address,
        items: orderData.items,
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee,
        total: orderData.total,
        notes: orderData.customerInfo.notes,
        paymentUrl: orderData.paymentUrl,
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

    // Send email to admin using Zoho SMTP
    await client.send({
      from: `ChopTym <support@choptym.com>`,
      to: 'choptym237@gmail.com',
      subject: `🍽️ New Order: ${orderData.orderNumber} - ${orderData.customerInfo.fullName}`,
      html,
      content: `New order ${orderData.orderNumber} from ${orderData.customerInfo.fullName}\nPhone: ${orderData.customerInfo.phone}\nAddress: ${orderData.customerInfo.address}\nTotal: ${orderData.total}\n`,
    });

    console.log('Admin notification sent via Zoho SMTP successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin notification sent via Zoho SMTP'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-admin-notification (Zoho SMTP):', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as any)?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});