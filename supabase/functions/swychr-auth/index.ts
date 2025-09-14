import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const email = Deno.env.get('SWYCHR_API_EMAIL');
    const password = Deno.env.get('SWYCHR_API_PASSWORD');

    if (!email || !password) {
      console.error('Missing Swychr credentials');
      return new Response(JSON.stringify({ error: 'Missing Swychr credentials' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticating with Swychr API...');

    const response = await fetch('https://api.accountpe.com/api/payin/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    let data: any;
    try {
      data = await response.json();
    } catch (_) {
      const text = await response.text();
      console.error('Non-JSON auth response:', text);
      return new Response(JSON.stringify({ 
        error: 'Invalid auth response',
        details: text 
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = data?.data?.token ?? data?.token;

    if (response.ok && token) {
      console.log('Swychr authentication successful');
      return new Response(JSON.stringify({ 
        success: true,
        token
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('Swychr authentication failed:', data);
      return new Response(JSON.stringify({ 
        error: 'Authentication failed',
        details: data 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in swychr-auth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});