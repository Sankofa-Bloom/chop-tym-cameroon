import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'https://esm.sh/react@18.3.1';
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22';
import { Resend } from 'https://esm.sh/resend@4.0.0';
import { OrderNotificationEmail } from './_templates/order-notification.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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
    console.log('Sending admin notification (Resend) for order:', orderData.orderNumber);
    console.log('Order data received:', JSON.stringify(orderData, null, 2));

    // Check if Resend API key is configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable not configured');
    }
    console.log('Resend API key found:', resendApiKey.substring(0, 10) + '...');

    // Render the React email template
    console.log('Rendering email template...');
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
    console.log('Email template rendered successfully');

    // Send email using Resend
    console.log('Sending email via Resend...');
    const { data, error } = await resend.emails.send({
      from: 'ChopTym <onboarding@resend.dev>',
      to: ['choptym237@gmail.com'],
      subject: `🍽️ New Order: ${orderData.orderNumber} - ${orderData.customerInfo.fullName}`,
      html,
      text: `New order ${orderData.orderNumber} from ${orderData.customerInfo.fullName}
Phone: ${orderData.customerInfo.phone}
Address: ${orderData.customerInfo.address}
Total: ${orderData.total}
${orderData.customerInfo.notes ? `Notes: ${orderData.customerInfo.notes}` : ''}
${orderData.paymentUrl ? `Payment URL: ${orderData.paymentUrl}` : ''}`,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Admin notification sent via Resend successfully:', data);

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin notification sent via Resend',
      data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-admin-notification-resend:', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as any)?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});