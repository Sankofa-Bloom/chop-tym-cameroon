import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create, getNumericDate, Header, Payload } from "https://deno.land/x/djwt@v2.9/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, error: 'Email and password are required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    const { data: user, error } = await supabase
      .from('auth_users')
      .select('id, email, password_hash, is_verified, full_name')
      .eq('email', email)
      .single();
    if (error || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (!user.is_verified) {
      return new Response(JSON.stringify({ success: false, error: 'Email not verified' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const jwtSecret = Deno.env.get('JWT_SECRET');
    if (!jwtSecret) {
      return new Response(JSON.stringify({ success: false, error: 'Server not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const header: Header = { alg: 'HS256', typ: 'JWT' };
    const payload: Payload = {
      sub: user.id,
      email: user.email,
      name: user.full_name ?? undefined,
      exp: getNumericDate(60 * 60 * 24 * 7), // 7 days
      iss: 'choptym',
    };

    const token = await create(header, payload, jwtSecret);

    return new Response(JSON.stringify({ success: true, token }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('auth-login error', error);
    return new Response(JSON.stringify({ success: false, error: (error as any)?.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


