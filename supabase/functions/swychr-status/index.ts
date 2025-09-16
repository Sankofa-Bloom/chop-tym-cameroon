import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payment_link_id } = await req.json();
    console.log('Checking Swychr payment status for:', payment_link_id, 'at', new Date().toISOString());

    if (!payment_link_id) {
      return new Response(
        JSON.stringify({ error: 'Payment link ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get Swychr access token
    const authResponse = await supabase.functions.invoke('swychr-auth');
    if (authResponse.error || !authResponse.data?.access_token) {
      console.error('Failed to get Swychr access token:', authResponse.error);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with Swychr' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const accessToken = authResponse.data.access_token;
    console.log('Got Swychr access token for status check');

    // Check payment status
    const statusResponse = await fetch(`https://api.accountpe.com/payment_link_status/${payment_link_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const statusData = await statusResponse.json();
    console.log('Swychr status response:', statusData);

    if (!statusResponse.ok) {
      console.error('Swychr status check failed:', statusData);
      return new Response(
        JSON.stringify({ 
          error: 'Status check failed', 
          details: statusData 
        }),
        { 
          status: statusResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: statusData.status,
        payment_link_id: statusData.payment_link_id,
        amount: statusData.amount,
        currency: statusData.currency,
        payment_reference: statusData.payment_reference,
        created_at: statusData.created_at,
        paid_at: statusData.paid_at,
        data: statusData
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in swychr-status function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});