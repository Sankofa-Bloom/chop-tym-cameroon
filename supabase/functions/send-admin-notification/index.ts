import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'https://esm.sh/react@18.3.1';
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { Resend } from 'npm:resend@4.0.0';
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
    console.log('Sending admin notification (Zoho SMTP) for order:', orderData);

    // Handle both nested and flat orderData structures
    const orderNumber = orderData.orderNumber || orderData.order_number;
    const customerName = orderData.customerInfo?.fullName || orderData.customer_name;
    const customerPhone = orderData.customerInfo?.phone || orderData.customer_phone;
    const deliveryAddress = orderData.customerInfo?.address || orderData.delivery_address;
    const notes = orderData.customerInfo?.notes || orderData.notes;
    
    // Render the React email template
    const html = await renderAsync(
      React.createElement(OrderNotificationEmail, {
        orderNumber: orderNumber,
        customerName: customerName,
        customerPhone: customerPhone,
        deliveryAddress: deliveryAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee || orderData.delivery_fee,
        total: orderData.total,
        notes: notes,
        paymentUrl: orderData.paymentUrl,
      })
    );

    // Prefer Resend first (more reliable), then fallback to Zoho SMTP
    let sent = false;

    // Try Resend first if API key is present
    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      if (resendApiKey) {
        const orderNumber = orderData.orderNumber || orderData.order_number;
        const customerName = orderData.customerInfo?.fullName || orderData.customer_name;

        const resend = new Resend(resendApiKey);
        const data = await resend.emails.send({
          from: 'ChopTym <onboarding@resend.dev>',
          to: ['choptym237@gmail.com'],
          subject: `🍽️ New Order: ${orderNumber} - ${customerName}`,
          html,
        });
        console.log('Admin notification sent via Resend', data?.id || '');
        sent = true;
      } else {
        console.warn('RESEND_API_KEY not set, skipping Resend and trying Zoho SMTP');
      }
    } catch (resendErr) {
      console.error('Resend send failed, will try Zoho SMTP fallback:', resendErr);
    }

    // If not sent via Resend, try Zoho SMTP
    if (!sent) {
      // Configure SMTP client for Zoho (use STARTTLS on 587, TLS on 465)
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

      try {
        const orderNumber = orderData.orderNumber || orderData.order_number;
        const customerName = orderData.customerInfo?.fullName || orderData.customer_name;
        const customerPhone = orderData.customerInfo?.phone || orderData.customer_phone;
        const deliveryAddress = orderData.customerInfo?.address || orderData.delivery_address;

        await client.send({
          from: `ChopTym <support@choptym.com>`,
          to: 'choptym237@gmail.com',
          subject: `🍽️ New Order: ${orderNumber} - ${customerName}`,
          html,
          content: `New order ${orderNumber} from ${customerName}\nPhone: ${customerPhone}\nAddress: ${deliveryAddress}\nTotal: ${orderData.total}\n`,
        });
        console.log('Admin notification sent via Zoho SMTP successfully');
        sent = true;
      } catch (smtpErr) {
        console.error('Zoho SMTP send failed:', smtpErr);
      }
    }
    if (!sent) {
      throw new Error('Failed to send admin notification via Resend and Zoho SMTP');
    }
    return new Response(JSON.stringify({
      success: true,
      message: 'Admin notification sent'
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