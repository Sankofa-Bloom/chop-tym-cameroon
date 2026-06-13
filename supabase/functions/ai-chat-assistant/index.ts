import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildSystemPrompt(activeTowns: string[], inactiveTowns: string[]) {
  const active = activeTowns.length ? activeTowns.join(", ") : "Limbe";
  const inactive = inactiveTowns.length ? inactiveTowns.join(", ") : "none";
  return `You be ChopTym AI — friendly Cameroonian assistant for food, errands & delivery. 🛵

VIBE:
- Warm, short, sweet. Mix small small Cameroon Pidgin ("how far", "na so", "no wahala", "i go", "you wan chop?", "we don hear you").
- Keep EVERY reply under 2 short sentences. No long talk.
- Use light emojis. No menu prices — team go confirm.

ACTIVE TOWNS (we dey deliver here): ${active}
NOT ACTIVE YET (politely refuse + offer waitlist via WhatsApp): ${inactive}

5-STEP FLOW (max):
1. Greet + ask wetin dem want (quick_replies: 🍲 Food, 🛒 Errand, 📦 Package, 💬 Other).
2. Ask town (quick_replies = ACTIVE TOWNS only + "Other").
   - If user pick "Other" or any inactive town → tell them sweetly say we never reach there yet, and ask them tap "Continue on WhatsApp" make team add them for waitlist. STOP the flow.
3. Ask wetin exactly dem want + address (one short message, free text).
4. Ask phone number.
5. Confirm short summary → call submit_order_request immediately on "yes".

RULES:
- ALWAYS use quick_replies tool when options dey (town, category, yes/no).
- Never invent prices. Never ask too many questions for one turn.
- If user wan human → tell them tap "Continue on WhatsApp" below.
- After submit: short confirm message, mention team go call them on di phone.`;
}

const tools = [
  {
    type: "function",
    function: {
      name: "quick_replies",
      description: "Show 2-4 tappable quick reply chips. Use anytime small choices make sense.",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string", description: "Short message above the chips." },
          options: { type: "array", items: { type: "string" }, description: "2-4 short labels (max ~20 chars)." },
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
      description: "Submit the gathered request to admin. Only call after user confirms.",
      parameters: {
        type: "object",
        properties: {
          request_type: { type: "string", enum: ["food_order", "errands", "package_delivery", "pickup_dropoff", "custom"] },
          customer_name: { type: "string" },
          customer_phone: { type: "string" },
          town: { type: "string" },
          delivery_address: { type: "string" },
          items_summary: { type: "string" },
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

async function getTowns(): Promise<{ active: string[]; inactive: string[] }> {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await supabase.from("towns").select("name, is_active");
    if (error) throw error;
    const active = (data || []).filter((t: any) => t.is_active).map((t: any) => t.name);
    const inactive = (data || []).filter((t: any) => !t.is_active).map((t: any) => t.name);
    return { active, inactive };
  } catch (e) {
    console.error("getTowns error:", e);
    return { active: ["Limbe"], inactive: [] };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { active, inactive } = await getTowns();
    const systemPrompt = buildSystemPrompt(active, inactive);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
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
        // @ts-ignore EdgeRuntime exists in Supabase
        if (typeof EdgeRuntime !== "undefined") EdgeRuntime.waitUntil(sendAdminEmail(args));
        else sendAdminEmail(args);
        if (!reply) {
          reply = `✅ We don hear you! Team go call you for ${args.customer_phone} just now. 🛵`;
        }
      }
    }

    if (!reply) reply = "Abeg say am again? 🙏";

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
