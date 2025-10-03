import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

const MTN_MOMO_API_USER = Deno.env.get('MTN_MOMO_API_USER')!;
const MTN_MOMO_API_KEY = Deno.env.get('MTN_MOMO_API_KEY')!;
const MTN_MOMO_SUBSCRIPTION_KEY = Deno.env.get('MTN_MOMO_SUBSCRIPTION_KEY')!;
const MTN_MOMO_BASE_URL = Deno.env.get('MTN_MOMO_BASE_URL') || 'https://sandbox.momodeveloper.mtn.com';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate UUID v4
function generateUUID(): string {
  return crypto.randomUUID();
}

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
    console.error('MTN access token error:', error);
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
    console.log('MTN MoMo payment creation started at:', new Date().toISOString());
    
    const { amount, phone, order_number, customer_name } = await req.json();

    // Validate inputs
    if (!amount || !phone || !order_number) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: amount, phone, order_number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format phone number (MTN expects format: 237XXXXXXXXX)
    let formattedPhone = phone.replace(/\s+/g, '');
    if (!formattedPhone.startsWith('237')) {
      formattedPhone = '237' + formattedPhone.replace(/^0+/, '');
    }

    // Generate reference ID for this transaction
    const referenceId = generateUUID();
    
    console.log('Getting MTN access token...');
    const accessToken = await getAccessToken();

    // Create payment request
    const paymentData = {
      amount: amount.toString(),
      currency: 'XAF',
      externalId: order_number,
      payer: {
        partyIdType: 'MSISDN',
        partyId: formattedPhone
      },
      payerMessage: `Payment for order ${order_number}`,
      payeeNote: `ChopTym Order ${order_number}`
    };

    console.log('Creating MTN MoMo payment request:', { referenceId, amount, phone: formattedPhone });

    const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': Deno.env.get('MTN_MOMO_ENVIRONMENT') || 'sandbox',
        'Ocp-Apim-Subscription-Key': MTN_MOMO_SUBSCRIPTION_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MTN payment request failed:', error);
      return new Response(
        JSON.stringify({ error: `Payment request failed: ${error}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('MTN MoMo payment created successfully:', referenceId);

    return new Response(
      JSON.stringify({
        success: true,
        reference_id: referenceId,
        order_number,
        status: 'pending',
        message: 'Payment request sent. Customer will receive a prompt on their phone.'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in mtn-momo-create-payment:', error);
    return new Response(
      JSON.stringify({ error: (error as Error)?.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
