import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'https://esm.sh/react@18.3.1';
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { SignupEmail } from './_templates/signup-email.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  console.log('Signup email function called');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Received webhook payload:', body);

    // Extract user data from Supabase auth webhook
    const { type, record } = body;
    
    if (type !== 'INSERT') {
      console.log('Not an INSERT event, skipping');
      return new Response(JSON.stringify({ message: 'Not an INSERT event' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const userEmail = record.email;
    const userName = record.raw_user_meta_data?.full_name || userEmail.split('@')[0];
    const confirmationUrl = record.confirmation_url;

    if (!userEmail) {
      throw new Error('No email found in user record');
    }

    console.log('Sending signup email to:', userEmail);

    // Render the React email template
    const html = await renderAsync(
      React.createElement(SignupEmail, {
        userName,
        userEmail,
        confirmationUrl,
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

    // Send the email
    await client.send({
      from: `ChopTym <support@choptym.com>`,
      to: userEmail,
      subject: 'Welcome to ChopTym! Please confirm your email 🍽️',
      html: html,
    });

    console.log('Signup confirmation email sent successfully to:', userEmail);

    return new Response(
      JSON.stringify({ success: true, message: 'Signup email sent successfully' }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error in send-signup-email function:', error);
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