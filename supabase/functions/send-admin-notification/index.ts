import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { OrderNotificationEmail } from './_templates/order-notification.tsx';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
    console.log('Sending admin notification for order:', orderData.orderNumber);

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

    // Configure ZOHO SMTP client
    const client = new SmtpClient();
    
    const smtpConfig = {
      hostname: Deno.env.get('ZOHO_SMTP_HOST') || 'smtp.zoho.com',
      port: parseInt(Deno.env.get('ZOHO_SMTP_PORT') || '587'),
      username: Deno.env.get('ZOHO_SMTP_USERNAME'),
      password: Deno.env.get('ZOHO_SMTP_PASSWORD'),
    };

    console.log('Connecting to ZOHO SMTP with config:', {
      hostname: smtpConfig.hostname,
      port: smtpConfig.port,
      username: smtpConfig.username,
      password: '***' // Hide password in logs
    });

    await client.connect(smtpConfig);

    // Send email to admin using ZOHO SMTP
    await client.send({
      from: smtpConfig.username || 'noreply@choptym.com',
      to: 'choptym237@gmail.com',
      subject: `🍽️ New Order: ${orderData.orderNumber} - ${orderData.customerInfo.fullName}`,
      content: html,
      html: html,
    });

    await client.close();

    console.log('Admin notification sent successfully via ZOHO SMTP');

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin notification sent successfully via ZOHO SMTP'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-admin-notification function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});