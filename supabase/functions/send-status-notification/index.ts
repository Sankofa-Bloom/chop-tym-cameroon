import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { StatusNotificationEmail } from './_templates/status-notification.tsx';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    console.log(`Sending ${notificationType} notification for order:`, orderData.orderNumber, `${oldStatus} → ${newStatus}`);

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
        paymentReference: orderData.paymentReference,
        createdAt: orderData.createdAt,
        notes: orderData.notes,
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

    await client.connect(smtpConfig);

    // Determine email subject based on notification type
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

    // Send email to admin using ZOHO SMTP
    await client.send({
      from: smtpConfig.username || 'noreply@choptym.com',
      to: 'choptym237@gmail.com',
      subject: subject,
      content: html,
      html: html,
    });

    await client.close();

    console.log('Status notification sent successfully via ZOHO SMTP');

    return new Response(JSON.stringify({
      success: true,
      message: 'Status notification sent successfully via ZOHO SMTP',
      notificationType,
      orderNumber: orderData.orderNumber
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-status-notification function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});