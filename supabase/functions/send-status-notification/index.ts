import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { StatusNotificationEmail } from './_templates/status-notification.tsx';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

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
    console.log(`Sending ${notificationType} admin email (Resend) for order:`, orderData.orderNumber, `${oldStatus} → ${newStatus}`);

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

    // Send email to admin using Resend
    const emailResponse = await resend.emails.send({
      from: 'ChopTym <onboarding@resend.dev>',
      to: ['choptym237@gmail.com'],
      subject,
      html,
    });

    console.log('Status notification sent via Resend:', (emailResponse as any)?.id || 'no-id');

    return new Response(JSON.stringify({
      success: true,
      message: 'Status notification sent via Resend',
      notificationType,
      orderNumber: orderData.orderNumber,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-status-notification (Resend):', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as any)?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});