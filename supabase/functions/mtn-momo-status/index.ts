import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

const MTN_MOMO_API_USER = Deno.env.get('MTN_MOMO_API_USER')!;
const MTN_MOMO_API_KEY = Deno.env.get('MTN_MOMO_API_KEY')!;
const MTN_MOMO_SUBSCRIPTION_KEY = Deno.env.get('MTN_MOMO_SUBSCRIPTION_KEY')!;
const MTN_MOMO_BASE_URL = Deno.env.get('MTN_MOMO_BASE_URL') || 'https://sandbox.momodeveloper.mtn.com';

// Get access token from MTN
async function getAccessToken(): Promise<string> {
  const authString = btoa(`${MTN_MOMO_API_USER}:${MTN_MOMO_API_KEY}`);
  
  const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Ocp-Apim-Subscription-Key': MTN_MOMO_SUBSCRIPTION_KEY,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('MTN MoMo status check started at:', new Date().toISOString());
    
    const { reference_id } = await req.json();

    if (!reference_id) {
      return new Response(
        JSON.stringify({ error: 'Missing reference_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Checking payment status for reference:', reference_id);
    const accessToken = await getAccessToken();

    const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay/${reference_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Target-Environment': Deno.env.get('MTN_MOMO_ENVIRONMENT') || 'sandbox',
        'Ocp-Apim-Subscription-Key': MTN_MOMO_SUBSCRIPTION_KEY,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MTN status check failed:', error);
      return new Response(
        JSON.stringify({ error: `Status check failed: ${error}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('MTN payment status:', data);

    // Map MTN status to our system
    let paymentStatus = 'pending';
    if (data.status === 'SUCCESSFUL') {
      paymentStatus = 'paid';
    } else if (data.status === 'FAILED') {
      paymentStatus = 'failed';
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          reference_id,
          status: paymentStatus,
          mtn_status: data.status,
          amount: data.amount,
          currency: data.currency,
          external_id: data.externalId,
          payer: data.payer,
          reason: data.reason || null
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in mtn-momo-status:', error);
    return new Response(
      JSON.stringify({ error: (error as Error)?.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
