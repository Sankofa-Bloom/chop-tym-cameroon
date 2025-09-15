import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { VerifyEmail } from '../auth-email/_templates/verify-email.tsx';
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateToken(length = 48): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, fullName } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, error: 'Email and password are required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    // Check if user exists
    const { data: existing, error: existingErr } = await supabase
      .from('auth_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (existingErr) throw existingErr;
    if (existing) {
      return new Response(JSON.stringify({ success: false, error: 'Email already registered' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const passwordHash = await bcrypt.hash(password);

    const { data: user, error: insertErr } = await supabase
      .from('auth_users')
      .insert({ email, password_hash: passwordHash, full_name: fullName ?? null })
      .select('*')
      .single();
    if (insertErr) throw insertErr;

    // Create verification token (valid for 24 hours)
    const token = generateToken(32);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { error: tokenErr } = await supabase
      .from('email_verification_tokens')
      .insert({ token, user_id: user.id, expires_at: expiresAt });
    if (tokenErr) throw tokenErr;

    const appBaseUrl = Deno.env.get('APP_BASE_URL') || 'https://choptym.com';
    const verifyUrl = `${appBaseUrl}/api/verify-email?token=${token}`;

    const html = await renderAsync(
      React.createElement(VerifyEmail, {
        userName: fullName || email,
        verifyUrl,
      })
    );

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

    await client.send({
      from: Deno.env.get('ZOHO_SMTP_USERNAME')!,
      to: email,
      subject: 'Verify your ChopTym email',
      html,
    });

    return new Response(JSON.stringify({ success: true, message: 'Signup successful, verification email sent' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('auth-signup error', error);
    return new Response(JSON.stringify({ success: false, error: (error as any)?.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


