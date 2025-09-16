import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

interface CreatePaymentPayload {
  orderNumber: string;
  amount: number; // in XAF
  currency?: string; // default XAF
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  description?: string;
  // optional custom metadata
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as CreatePaymentPayload;
    const {
      orderNumber,
      amount,
      currency = 'XAF',
      customerEmail,
      customerName,
      customerPhone,
      description = 'ChopTym order payment',
      metadata = {},
    } = body;

    if (!orderNumber || !amount) {
      return new Response(JSON.stringify({ success: false, error: 'orderNumber and amount are required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const apiBase = Deno.env.get('FAPSHI_API_BASE') || 'https://api.fapshi.com';
    const secretKey = Deno.env.get('FAPSHI_SECRET_KEY');
    const publicKey = Deno.env.get('FAPSHI_PUBLIC_KEY') || Deno.env.get('FAPSHI_MERCHANT_KEY') || Deno.env.get('FAPSHI_API_USER');
    const appBaseUrl = Deno.env.get('APP_BASE_URL') || 'https://choptym.com';
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!secretKey || !publicKey) {
      const missing = [
        !secretKey ? 'FAPSHI_SECRET_KEY' : null,
        !publicKey ? 'FAPSHI_PUBLIC_KEY|FAPSHI_MERCHANT_KEY|FAPSHI_API_USER' : null
      ].filter(Boolean).join(', ');
      return new Response(JSON.stringify({ success: false, error: 'Payment gateway keys not configured', missing }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Construct callback URLs for the gateway to redirect and webhook notify
    const successUrl = `${appBaseUrl}/payment/success?order=${encodeURIComponent(orderNumber)}`;
    const cancelUrl = `${appBaseUrl}/payment/cancel?order=${encodeURIComponent(orderNumber)}`;
    const webhookUrl = `${supabaseUrl || 'https://qiupqrmtxwtgipbwcvoo.supabase.co'}/functions/v1/payments-webhook`;

    // NOTE: Adjust payload to match Fapshi API exactly. This is a commonly used structure.
    const gatewayPayload: Record<string, unknown> = {
      reference: orderNumber,
      amount,
      currency,
      customer: {
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
      },
      description,
      success_url: successUrl,
      cancel_url: cancelUrl,
      webhook_url: webhookUrl,
      metadata,
      public_key: publicKey,
    };

    let resp: Response;
    try {
      resp = await fetch(`${apiBase}/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
        },
        body: JSON.stringify(gatewayPayload),
      });
    } catch (networkErr) {
      console.error('payments-create network error:', networkErr);
      return new Response(JSON.stringify({ success: false, error: 'Network error calling Fapshi API', details: String(networkErr) }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const raw = await resp.text();
    let data: any = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { raw }; }
    if (!resp.ok) {
      console.error('payments-create gateway error:', resp.status, raw);
      return new Response(JSON.stringify({ success: false, error: data?.message || 'Failed to create payment', status: resp.status, gateway: data }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Expecting data to contain a checkout/payment url and a transaction reference/id
    const checkoutUrl = data.checkout_url || data.payment_url || data.url || data.paymentLink;
    const transactionRef = data.reference || data.tx_ref || data.id || data.reference_id;

    if (!checkoutUrl) {
      console.error('payments-create missing checkoutUrl in response:', data);
      return new Response(JSON.stringify({ success: false, error: 'Gateway did not return a checkout URL', gateway: data }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, checkoutUrl, transactionRef, gateway: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('payments-create error', error);
    return new Response(JSON.stringify({ success: false, error: (error as any)?.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


