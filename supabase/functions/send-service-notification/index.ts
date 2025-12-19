import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function safe(str: unknown): string {
  return String(str ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}

const serviceTypeLabels: Record<string, string> = {
  errands: "🛒 Errands",
  "package-delivery": "📦 Package Delivery",
  "pickups-dropoffs": "🚚 Pickups & Drop-offs",
  "custom-request": "💬 Custom Request",
};

function buildEmailHtml(request: any): string {
  const serviceNumber = safe(request.serviceNumber);
  const serviceType = serviceTypeLabels[request.serviceType] || request.serviceType;
  const customerName = safe(request.customerName);
  const customerPhone = safe(request.customerPhone);
  const town = safe(request.town);
  const pickupLocation = safe(request.pickupLocation);
  const dropoffLocation = request.dropoffLocation ? safe(request.dropoffLocation) : null;
  const description = safe(request.description);
  const optionalMessage = request.optionalMessage ? safe(request.optionalMessage) : null;
  const paymentMethod = request.paymentMethod === "delivery" ? "Pay on Delivery" : "Mobile Money";

  return `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.5;">
  <div style="max-width:640px;margin:0 auto;padding:16px;">
    <h2 style="margin:0 0 8px;color:#ea580c;">🆕 New Service Request!</h2>
    <p style="margin:0 0 12px;">A new service request has been submitted.</p>
    
    <div style="border:1px solid #eee;border-radius:8px;padding:12px;background:#fafafa;">
      <p style="margin:0 0 6px;"><strong>Request #:</strong> ${serviceNumber}</p>
      <p style="margin:0 0 6px;"><strong>Service Type:</strong> ${serviceType}</p>
      <p style="margin:0 0 6px;"><strong>Town:</strong> ${town}</p>
    </div>
    
    <h3 style="margin:16px 0 8px;">👤 Customer Details</h3>
    <div style="border:1px solid #eee;border-radius:8px;padding:12px;">
      <p style="margin:0 0 6px;"><strong>Name:</strong> ${customerName}</p>
      <p style="margin:0 0 6px;"><strong>Phone:</strong> ${customerPhone}</p>
      <p style="margin:0;"><strong>WhatsApp:</strong> <a href="https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}">Click to chat</a></p>
    </div>
    
    <h3 style="margin:16px 0 8px;">📍 Location Details</h3>
    <div style="border:1px solid #eee;border-radius:8px;padding:12px;">
      <p style="margin:0 0 6px;"><strong>Pickup/Service Location:</strong><br/>${pickupLocation}</p>
      ${dropoffLocation ? `<p style="margin:0;"><strong>Drop-off Location:</strong><br/>${dropoffLocation}</p>` : ""}
    </div>
    
    <h3 style="margin:16px 0 8px;">📝 Request Details</h3>
    <div style="border:1px solid #eee;border-radius:8px;padding:12px;">
      <p style="margin:0 0 6px;"><strong>Description:</strong><br/>${description}</p>
      ${optionalMessage ? `<p style="margin:0;"><strong>Additional Notes:</strong><br/>${optionalMessage}</p>` : ""}
    </div>
    
    <h3 style="margin:16px 0 8px;">💳 Payment</h3>
    <div style="border:1px solid #eee;border-radius:8px;padding:12px;">
      <p style="margin:0;"><strong>Method:</strong> ${paymentMethod}</p>
    </div>
    
    <p style="margin:16px 0 0;padding:12px;background:#fef3c7;border-radius:8px;color:#92400e;">
      ⚠️ Please contact the customer to confirm the request and provide a price quote.
    </p>
  </div>
</body></html>`;
}

function buildWhatsAppMessage(request: any): string {
  const serviceNumber = request.serviceNumber;
  const serviceType = serviceTypeLabels[request.serviceType] || request.serviceType;
  const customerName = request.customerName;
  const customerPhone = request.customerPhone;
  const town = request.town;
  const pickupLocation = request.pickupLocation;
  const dropoffLocation = request.dropoffLocation;
  const description = request.description;
  const paymentMethod = request.paymentMethod === "delivery" ? "Pay on Delivery" : "Mobile Money";

  let message = `🆕 *NEW SERVICE REQUEST*\n\n`;
  message += `*Request #:* ${serviceNumber}\n`;
  message += `*Type:* ${serviceType}\n`;
  message += `*Town:* ${town}\n\n`;
  message += `👤 *Customer:*\n`;
  message += `Name: ${customerName}\n`;
  message += `Phone: ${customerPhone}\n\n`;
  message += `📍 *Location:*\n`;
  message += `From: ${pickupLocation}\n`;
  if (dropoffLocation) {
    message += `To: ${dropoffLocation}\n`;
  }
  message += `\n📝 *Description:*\n${description}\n\n`;
  message += `💳 *Payment:* ${paymentMethod}\n\n`;
  message += `⏰ Please contact customer ASAP!`;

  return message;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    console.log("send-service-notification received:", JSON.stringify(body, null, 2));

    // Send email notification via SMTP
    try {
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

      const html = buildEmailHtml(body);
      const serviceType = serviceTypeLabels[body.serviceType] || body.serviceType;

      await client.send({
        from: `ChopTym Services <support@choptym.com>`,
        to: "choptym237@gmail.com",
        subject: `${serviceType} - ${body.serviceNumber} - ${body.customerName}`,
        html,
      });

      console.log("Admin email (service request) sent via Zoho SMTP");
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the whole request if email fails
    }

    // Log WhatsApp message (for manual sending or future integration)
    const whatsappMessage = buildWhatsAppMessage(body);
    console.log("WhatsApp notification message:\n", whatsappMessage);

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-service-notification:", error);
    return new Response(
      JSON.stringify({ error: (error as any)?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
