import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { PaymentNotificationEmail } from './_templates/payment-notification.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  console.log('Payment notification email function called');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      orderNumber,
      customerName,
      customerEmail,
      total,
      paymentStatus,
      paymentReference,
      paymentUrl
    } = await req.json();
    
    console.log('Sending payment notification to:', customerEmail, 'Status:', paymentStatus);

    // Render the React email template
    const html = await renderAsync(
      React.createElement(PaymentNotificationEmail, {
        orderNumber,
        customerName,
        total,
        paymentStatus,
        paymentReference,
        paymentUrl,
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

    // Get subject based on payment status
    let subject = '';
    switch (paymentStatus) {
      case 'success':
        subject = `Payment Successful - Order #${orderNumber}`;
        break;
      case 'failed':
        subject = `Payment Failed - Order #${orderNumber}`;
        break;
      case 'pending':
        subject = `Payment Processing - Order #${orderNumber}`;
        break;
      default:
        subject = `Payment Update - Order #${orderNumber}`;
    }

    // Send the email
    await client.send({
      from: `ChopTym <support@choptym.com>`,
      to: customerEmail,
      subject: subject,
      html: html,
    });

    console.log('Payment notification email sent successfully to:', customerEmail);

    return new Response(
      JSON.stringify({ success: true, message: 'Payment notification email sent successfully' }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error in send-payment-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});