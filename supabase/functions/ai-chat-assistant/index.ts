import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are ChopTym's friendly AI customer service agent for a food & errands delivery service in Cameroon (Buea, Limbe, Douala).

Your job: help users place an order or service request through quick, easy chat. Keep responses SHORT (1-3 sentences). Be warm, use light emojis, and speak like a helpful local.

CONVERSATION FLOW:
1. Greet, then ask what they need (food order, errands, package delivery, custom request).
2. Ask their town (Buea, Limbe, Douala, or Other).
3. Gather details step-by-step: items/dishes wanted, quantity, pickup/delivery address, phone number, any notes.
4. Confirm the full summary back to them.
5. When they confirm, call the "submit_order_request" tool.

CRITICAL RULES:
- Whenever helpful, propose 2-4 quick-reply options the user can tap. Return them in the "quick_replies" tool.
- Always collect a phone number before submitting.
- If user wants to talk to a human, tell them to tap "Continue on WhatsApp" below.
- Don't invent menu prices — ask the user what they want and confirm price will be shared by the team.
- After successful submission, tell them the team will contact them shortly via WhatsApp/phone.`;

const tools = [
  {
    type: "function",
    function: {
      name: "quick_replies",
      description: "Show 2-4 tappable quick reply chips to the user to make answering easier. Use anytime a small set of choices makes sense (town, category, yes/no, payment method, etc.).",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string", description: "Your message to display above the chips." },
          options: {
            type: "array",
            items: { type: "string" },
            description: "2-4 short option labels (max ~25 chars each).",
          },
        },
        required: ["message", "options"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "submit_order_request",
      description: "Submit the gathered order/service request to the admin. Only call once the user has confirmed the summary.",
      parameters: {
        type: "object",
        properties: {
          request_type: {
            type: "string",
            enum: ["food_order", "errands", "package_delivery", "pickup_dropoff", "custom"],
          },
          customer_name: { type: "string" },
          customer_phone: { type: "string" },
          town: { type: "string" },
          delivery_address: { type: "string" },
          items_summary: { type: "string", description: "Plain-text summary of what the user wants." },
          notes: { type: "string" },
        },
        required: ["request_type", "customer_phone", "town", "items_summary"],
        additionalProperties: false,
      },
    },
  },
];

async function sendAdminEmail(payload: any) {
  try {
    const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
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

    const safe = (s: unknown) =>
      String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));

    const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.5;">
<div style="max-width:640px;margin:0 auto;padding:16px;">
  <h2 style="margin:0 0 8px;color:#ea580c;">🤖 New AI Chat Request</h2>
  <p style="margin:0 0 12px;">A customer placed a request via the AI chat assistant.</p>
  <div style="border:1px solid #eee;border-radius:8px;padding:12px;background:#fafafa;">
    <p style="margin:0 0 6px;"><strong>Type:</strong> ${safe(payload.request_type)}</p>
    <p style="margin:0 0 6px;"><strong>Name:</strong> ${safe(payload.customer_name || "Not provided")}</p>
    <p style="margin:0 0 6px;"><strong>Phone:</strong> ${safe(payload.customer_phone)} — <a href="https://wa.me/${safe(payload.customer_phone).replace(/[^0-9]/g, "")}">WhatsApp</a></p>
    <p style="margin:0 0 6px;"><strong>Town:</strong> ${safe(payload.town)}</p>
    <p style="margin:0 0 6px;"><strong>Address:</strong> ${safe(payload.delivery_address || "—")}</p>
    <p style="margin:0 0 6px;"><strong>Request:</strong><br/>${safe(payload.items_summary)}</p>
    ${payload.notes ? `<p style="margin:0;"><strong>Notes:</strong><br/>${safe(payload.notes)}</p>` : ""}
  </div>
  <p style="margin:16px 0 0;padding:12px;background:#fef3c7;border-radius:8px;color:#92400e;">⚠️ Contact the customer to confirm details and pricing.</p>
</div></body></html>`;

    await client.send({
      from: `ChopTym AI <support@choptym.com>`,
      to: "choptym237@gmail.com",
      subject: `🤖 AI Chat Request - ${payload.request_type} - ${payload.customer_name || payload.customer_phone}`,
      html,
    });
    await client.close();
    console.log("Admin email sent for AI chat request");
  } catch (e) {
    console.error("Failed to send admin email:", e);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        tools,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const choice = data.choices?.[0]?.message;
    const toolCalls = choice?.tool_calls || [];

    let reply = choice?.content || "";
    let quickReplies: string[] = [];
    let submitted: any = null;

    for (const tc of toolCalls) {
      const name = tc.function?.name;
      let args: any = {};
      try {
        args = JSON.parse(tc.function?.arguments || "{}");
      } catch {}

      if (name === "quick_replies") {
        if (args.message) reply = args.message;
        if (Array.isArray(args.options)) quickReplies = args.options.slice(0, 4);
      } else if (name === "submit_order_request") {
        submitted = args;
        // Fire-and-forget admin email
        // @ts-ignore EdgeRuntime exists in Supabase
        if (typeof EdgeRuntime !== "undefined") EdgeRuntime.waitUntil(sendAdminEmail(args));
        else sendAdminEmail(args);
        if (!reply) {
          reply = `✅ Got it! I've sent your request to our team. They'll contact you on ${args.customer_phone} shortly. You can also tap "Continue on WhatsApp" below to chat with a human now.`;
        }
      }
    }

    if (!reply) reply = "Sorry, I didn't catch that. Could you say it again?";

    return new Response(
      JSON.stringify({ reply, quick_replies: quickReplies, submitted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("ai-chat-assistant error:", error);
    return new Response(
      JSON.stringify({ error: (error as any)?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
