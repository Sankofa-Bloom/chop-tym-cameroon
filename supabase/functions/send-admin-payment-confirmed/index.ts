import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function safe(str: unknown): string {
  return String(str ?? "").replace(/[&<>]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c] as string));
}

function formatCurrency(n: unknown): string {
  const num = typeof n === "number" ? n : Number(n ?? 0);
  return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF" }).format(num);
}

function buildItemsHtml(items: any[]): string {
  if (!Array.isArray(items) || items.length === 0) return "<p>No items provided.</p>";
  const rows = items.map((it) => {
    const name = safe(it?.name);
    const qty = safe(it?.quantity ?? 1);
    const price = formatCurrency(it?.price ?? 0);
    const total = formatCurrency((it?.price ?? 0) * (it?.quantity ?? 1));
    return `<tr><td style=\"padding:6px 8px;border:1px solid #eee;\">${name}</td><td style=\"padding:6px 8px;border:1px solid #eee;\">${qty}</td><td style=\"padding:6px 8px;border:1px solid #eee;\">${price}</td><td style=\"padding:6px 8px;border:1px solid #eee;\">${total}</td></tr>`;
  }).join("");
  return `<table style=\"border-collapse:collapse;width:100%;margin-top:8px;\">\n<thead><tr><th align=\"left\" style=\"padding:6px 8px;border:1px solid #eee;background:#fafafa;\">Item</th><th align=\"left\" style=\"padding:6px 8px;border:1px solid #eee;background:#fafafa;\">Qty</th><th align=\"left\" style=\"padding:6px 8px;border:1px solid #eee;background:#fafafa;\">Price</th><th align=\"left\" style=\"padding:6px 8px;border:1px solid #eee;background:#fafafa;\">Total</th></tr></thead>\n<tbody>${rows}</tbody></table>`;
}

function buildEmailHtml(order: any): string {
  const orderNumber = safe(order.orderNumber ?? order.order_number ?? "");
  const customerName = safe(order.customerInfo?.fullName ?? order.customer_name ?? "");
  const customerPhone = safe(order.customerInfo?.phone ?? order.customer_phone ?? "");
  const deliveryAddress = safe(order.customerInfo?.address ?? order.delivery_address ?? "");
  const notes = safe(order.customerInfo?.notes ?? order.notes ?? "Payment confirmed.");
  const subtotal = formatCurrency(order.subtotal ?? order.total);
  const deliveryFee = formatCurrency(order.deliveryFee ?? order.delivery_fee ?? 0);
  const total = formatCurrency(order.total);

  const itemsHtml = buildItemsHtml(order.items ?? []);

  return `<!doctype html><html><body style=\"font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.5;\">\n  <div style=\"max-width:640px;margin:0 auto;padding:16px;\">\n    <h2 style=\"margin:0 0 8px;\">Payment Confirmed</h2>\n    <p style=\"margin:0 0 12px;\">A payment has just been confirmed for the order.</p>\n    <div style=\"border:1px solid #eee;border-radius:8px;padding:12px;\">\n      <p style=\"margin:0 0 6px;\"><strong>Order #:</strong> ${orderNumber}</p>\n      <p style=\"margin:0 0 6px;\"><strong>Name:</strong> ${customerName}</p>\n      <p style=\"margin:0 0 6px;\"><strong>Phone:</strong> ${customerPhone}</p>\n      <p style=\"margin:0 0 6px;\"><strong>Address:</strong> ${deliveryAddress}</p>\n      ${notes ? `<p style=\\"margin:0 0 6px;\\"><strong>Notes:</strong> ${notes}</p>` : ""}\n      <div style=\"margin-top:12px;\">${itemsHtml}</div>\n      <div style=\"margin-top:12px;border-top:1px dashed #e5e5e5;padding-top:10px;\">\n        <p style=\"margin:0 0 6px;\"><strong>Subtotal:</strong> ${subtotal}</p>\n        <p style=\"margin:0 0 6px;\"><strong>Delivery:</strong> ${deliveryFee}</p>\n        <p style=\"margin:0;\"><strong>Total:</strong> ${total}</p>\n      </div>\n    </div>\n  </div>\n</body></html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const order = body?.orderData ?? body;

    const orderNumber = order.orderNumber ?? order.order_number ?? "";
    const customerName = order.customerInfo?.fullName ?? order.customer_name ?? "";

    console.log("send-admin-payment-confirmed received:", { orderNumber, customerName });

    const smtpPort = parseInt(Deno.env.get("ZOHO_SMTP_PORT") || "587");
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get("ZOHO_SMTP_HOST") || "smtp.zoho.com",
        port: smtpPort,
        tls: smtpPort === 465,
        auth: {
          username: Deno.env.get("ZOHO_SMTP_USERNAME")!,
          password: Deno.env.get("ZOHO_SMTP_PASSWORD")!,
        },
      },
    });

    const html = buildEmailHtml(order);

    await client.send({
      from: `ChopTym <support@choptym.com>`,
      to: "choptym237@gmail.com",
      subject: `✅ Payment Confirmed: ${orderNumber} - ${customerName}`,
      html,
    });

    console.log("Admin email (payment confirmed) sent via Zoho SMTP");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-admin-payment-confirmed:", error);
    return new Response(
      JSON.stringify({ error: (error as any)?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});