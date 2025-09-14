import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { OrderNotificationEmail } from './_templates/order-notification.tsx';
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
    const { orderData } = await req.json();
    console.log('Sending admin notification (Resend) for order:', orderData.orderNumber);

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

    // Send email to admin using Resend
    const emailResponse = await resend.emails.send({
      from: 'ChopTym <onboarding@resend.dev>',
      to: ['choptym237@gmail.com'],
      subject: `🍽️ New Order: ${orderData.orderNumber} - ${orderData.customerInfo.fullName}`,
      html,
    });

    console.log('Admin notification sent via Resend:', (emailResponse as any)?.id || 'no-id');

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin notification sent via Resend'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-admin-notification (Resend):', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as any)?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});