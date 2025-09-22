import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { Resend } from 'npm:resend@4.0.0';
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

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'ChopTym <support@choptym.com>',
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