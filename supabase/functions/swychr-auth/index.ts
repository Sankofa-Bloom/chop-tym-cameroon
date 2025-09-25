import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const email = Deno.env.get('SWYCHR_API_EMAIL');
    const password = Deno.env.get('SWYCHR_API_PASSWORD');

    if (!email || !password) {
      console.error('Missing Swychr credentials');
      return new Response(
        JSON.stringify({ error: 'Missing Swychr credentials' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Authenticating with Swychr API...', new Date().toISOString());

    const authResponse = await fetch('https://api.accountpe.com/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const authData = await authResponse.json();
    console.log('Swychr auth response:', authData);

    if (!authResponse.ok) {
      console.error('Swychr authentication failed:', authData);
      return new Response(
        JSON.stringify({ 
          error: 'Authentication failed', 
          details: authData 
        }),
        { 
          status: authResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        access_token: authData.access_token,
        expires_in: authData.expires_in 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in swychr-auth function:', error);
    return new Response(
      JSON.stringify({ error: (error as Error)?.message || 'Unknown error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});