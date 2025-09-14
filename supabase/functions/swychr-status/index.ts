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
    const { transaction_id } = await req.json();

    if (!transaction_id) {
      return new Response(JSON.stringify({ error: 'Transaction ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Checking payment status for:', transaction_id);

    // First get authentication token
    const authResponse = await fetch(`${req.headers.get('origin')}/functions/v1/swychr-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with Swychr');
    }

    const authData = await authResponse.json();
    const token = authData.token;

    // Check payment status
    const statusResponse = await fetch(`https://api.swychrconnect.com/payment/status/${transaction_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const statusData = await statusResponse.json();

    if (statusResponse.ok) {
      console.log('Payment status retrieved:', statusData);
      return new Response(JSON.stringify({
        success: true,
        data: statusData.data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('Failed to get payment status:', statusData);
      return new Response(JSON.stringify({
        error: 'Failed to get payment status',
        details: statusData
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in swychr-status function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});