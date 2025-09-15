import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token') || (await req.clone().json().catch(() => ({}))).token;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Missing token' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    const { data: tokenRow, error: tokenErr } = await supabase
      .from('email_verification_tokens')
      .select('token, user_id, expires_at, used')
      .eq('token', token)
      .single();
    if (tokenErr || !tokenRow) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (tokenRow.used) {
      return new Response(JSON.stringify({ success: false, error: 'Token already used' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ success: false, error: 'Token expired' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { error: userErr } = await supabase
      .from('auth_users')
      .update({ is_verified: true })
      .eq('id', tokenRow.user_id);
    if (userErr) throw userErr;

    const { error: markErr } = await supabase
      .from('email_verification_tokens')
      .update({ used: true })
      .eq('token', token);
    if (markErr) throw markErr;

    return new Response(JSON.stringify({ success: true, message: 'Email verified successfully' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('auth-verify-email error', error);
    return new Response(JSON.stringify({ success: false, error: (error as any)?.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


