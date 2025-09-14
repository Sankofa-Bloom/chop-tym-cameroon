import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, reference } = await req.json();
    
    if (!sessionId && !reference) {
      throw new Error('Either sessionId or reference is required');
    }

    console.log('Checking Fapshi payment status for:', { sessionId, reference });

    // Get Fapshi credentials
    const fapshiApiKey = Deno.env.get('FAPSHI_API_KEY');
    const fapshiApiUser = Deno.env.get('FAPSHI_API_USER');
    if (!fapshiApiKey || !fapshiApiUser) {
      throw new Error('FAPSHI_API_KEY and FAPSHI_API_USER not configured');
    }

    // Check payment status with Fapshi API (using sandbox) - requires transId
    const statusUrl = `https://sandbox.fapshi.com/payment-status/${sessionId || reference}`;
    
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'apikey': fapshiApiKey,
        'apiuser': fapshiApiUser,
      },
    });

    let data: any;
    const responseText = await response.text();
    try {
      data = JSON.parse(responseText);
    } catch (_) {
      console.error('Non-JSON Fapshi status response:', responseText);
      throw new Error('Invalid response from Fapshi API');
    }

    if (response.ok) {
      console.log('Fapshi payment status retrieved successfully:', data[0]?.status);
      return new Response(JSON.stringify({
        success: true,
        data: data[0] // Fapshi returns array, we want first item
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      console.error('Fapshi status check failed:', data);
      return new Response(JSON.stringify({
        success: false,
        error: data.message || 'Failed to check payment status',
        details: data
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error in fapshi-status function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});