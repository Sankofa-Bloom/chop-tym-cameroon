import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PaymentStatus = 'success' | 'failed' | 'pending';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const secret = Deno.env.get('FAPSHI_WEBHOOK_SECRET');
    const signature = req.headers.get('x-fapshi-signature') || req.headers.get('x-signature');
    const rawBody = await req.text();

    // Basic signature check if provided (adjust per Fapshi docs)
    if (secret && signature) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
      const expected = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
      if (expected !== signature) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const payload = JSON.parse(rawBody || '{}');
    // Normalize expected fields
    const orderNumber: string = payload.reference || payload.tx_ref || payload.orderNumber;
    const status: PaymentStatus = payload.status || (payload.success ? 'success' : 'failed');
    const amount: number = payload.amount || payload.amount_paid || 0;
    const customerEmail: string | undefined = payload.customer?.email || payload.email;
    const customerName: string | undefined = payload.customer?.name || payload.name;
    const paymentReference: string | undefined = payload.reference || payload.tx_ref || payload.id;

    // Update order in DB
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );
    const updateFields: Record<string, unknown> = {
      payment_status: status,
      payment_reference: paymentReference,
      updated_at: new Date().toISOString(),
    };
    if (status === 'success') {
      updateFields['status'] = 'paid';
      updateFields['paid_at'] = new Date().toISOString();
    }
    await supabase.from('orders').update(updateFields).eq('order_number', orderNumber);

    // Fetch order details to enrich email if available
    const { data: orderRow } = await supabase
      .from('orders')
      .select('customer_email, customer_name, subtotal, delivery_fee, total')
      .eq('order_number', orderNumber)
      .maybeSingle();

    // Send email via Zoho
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get('ZOHO_SMTP_HOST') || 'smtp.zoho.com',
        port: parseInt(Deno.env.get('ZOHO_SMTP_PORT') || '587'),
        tls: true,
        auth: {
          username: Deno.env.get('ZOHO_SMTP_USERNAME')!,
          password: Deno.env.get('ZOHO_SMTP_PASSWORD')!,
        },
      },
    });

    const subject = status === 'success'
      ? `✅ Payment Successful • ${orderNumber}`
      : status === 'failed'
      ? `❌ Payment Failed • ${orderNumber}`
      : `⏰ Payment Pending • ${orderNumber}`;

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:16px">
        <h2>${subject}</h2>
        <p>Order: <strong>${orderNumber}</strong></p>
        <p>Status: <strong>${status.toUpperCase()}</strong></p>
        <p>Amount: <strong>${amount}</strong></p>
        ${customerName || orderRow?.customer_name ? `<p>Name: ${customerName || orderRow?.customer_name}</p>` : ''}
        ${customerEmail || orderRow?.customer_email ? `<p>Email: ${customerEmail || orderRow?.customer_email}</p>` : ''}
        <p>Thank you for choosing ChopTym.</p>
      </div>
    `;

    const recipientEmail = customerEmail || orderRow?.customer_email;
    if (recipientEmail) {
      await client.send({
        from: Deno.env.get('ZOHO_SMTP_USERNAME')!,
        to: recipientEmail,
        subject,
        html,
      });
    }

    // Optionally notify admin
    await client.send({
      from: Deno.env.get('ZOHO_SMTP_USERNAME')!,
      to: 'choptym237@gmail.com',
      subject: `[Admin] ${subject}`,
      html,
    });

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('payments-webhook error', error);
    return new Response(JSON.stringify({ success: false, error: (error as any)?.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


