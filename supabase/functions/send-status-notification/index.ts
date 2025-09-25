import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'https://esm.sh/react@18.3.1';
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { StatusNotificationEmail } from './_templates/status-notification.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData, oldStatus, newStatus, notificationType } = await req.json();
    console.log(`Sending ${notificationType} admin email (Zoho SMTP) for order:`, orderData.orderNumber, `${oldStatus} → ${newStatus}`);

    // Render the React email template
    const html = await renderAsync(
      React.createElement(StatusNotificationEmail, {
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        deliveryAddress: orderData.deliveryAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee,
        total: orderData.total,
        oldStatus,
        newStatus,
        notificationType,
        createdAt: orderData.createdAt,
        notes: orderData.notes,
      })
    );

    // Determine subject
    let subject = '';
    switch (notificationType) {
      case 'success':
        subject = `✅ Payment Successful: ${orderData.orderNumber} - ${orderData.customerName}`;
        break;
      case 'failed':
        subject = `❌ Payment Failed: ${orderData.orderNumber} - ${orderData.customerName}`;
        break;
      case 'pending_long':
        subject = `⏰ Order Pending Too Long: ${orderData.orderNumber} - ${orderData.customerName}`;
        break;
      case 'status_update':
        subject = `📋 Order Status Updated: ${orderData.orderNumber} - ${oldStatus} → ${newStatus}`;
        break;
      default:
        subject = `📦 Order Update: ${orderData.orderNumber} - ${orderData.customerName}`;
    }

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
      from: Deno.env.get('ZOHO_SMTP_USERNAME')!,
      to: 'choptym237@gmail.com',
      subject,
      html,
    });

    console.log('Status notification sent via Zoho SMTP successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Status notification sent via Zoho SMTP',
      notificationType,
      orderNumber: orderData.orderNumber,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-status-notification (Zoho SMTP):', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as any)?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});