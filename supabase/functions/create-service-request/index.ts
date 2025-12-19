import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ServiceRequestPayload {
  serviceType: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation?: string | null;
  description: string;
  optionalMessage?: string | null;
  paymentMethod: string;
  town: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: ServiceRequestPayload = await req.json();
    console.log("Received service request payload:", JSON.stringify(payload, null, 2));

    // Validation
    const requiredFields = ["serviceType", "customerName", "customerPhone", "pickupLocation", "description", "town"];
    for (const field of requiredFields) {
      if (!payload[field as keyof ServiceRequestPayload]) {
        console.error(`Missing required field: ${field}`);
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate phone number format
    const phoneRegex = /^\+237[0-9]{9}$/;
    const normalizedPhone = payload.customerPhone.replace(/\s+/g, "");
    if (!phoneRegex.test(normalizedPhone)) {
      console.error("Invalid phone number format:", normalizedPhone);
      return new Response(
        JSON.stringify({ error: "Invalid phone number format. Use +237 followed by 9 digits." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate service request number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const serviceNumber = `SVC-${payload.town.substring(0, 3).toUpperCase()}-${dateStr}-${randomSuffix}`;

    // Build notes/description for the order
    const serviceTypeLabels: Record<string, string> = {
      errands: "Errands",
      "package-delivery": "Package Delivery",
      "pickups-dropoffs": "Pickups & Drop-offs",
      "custom-request": "Custom Request",
    };

    const notes = `
SERVICE REQUEST: ${serviceTypeLabels[payload.serviceType] || payload.serviceType}

PICKUP/SERVICE LOCATION:
${payload.pickupLocation}

${payload.dropoffLocation ? `DROP-OFF LOCATION:\n${payload.dropoffLocation}\n` : ""}
DESCRIPTION:
${payload.description}

${payload.optionalMessage ? `ADDITIONAL NOTES:\n${payload.optionalMessage}\n` : ""}
PAYMENT PREFERENCE: ${payload.paymentMethod === "delivery" ? "Pay on Delivery" : "Mobile Money"}
    `.trim();

    // Create order record (using orders table with service type indicator)
    const orderData = {
      order_number: serviceNumber,
      customer_name: payload.customerName.trim(),
      customer_phone: normalizedPhone,
      delivery_address: payload.dropoffLocation || payload.pickupLocation,
      town: payload.town,
      items: [
        {
          name: `${serviceTypeLabels[payload.serviceType] || "Service"} Request`,
          restaurant: "ChopTym Services",
          price: 0, // Price TBD
          quantity: 1,
          serviceType: payload.serviceType,
        },
      ],
      subtotal: 0,
      delivery_fee: 0,
      total: 0, // Price to be confirmed
      notes: notes,
      payment_method: payload.paymentMethod === "delivery" ? "delivery" : "momo",
      payment_status: "pending",
    };

    console.log("Creating service request order:", JSON.stringify(orderData, null, 2));

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("Error creating service request:", orderError);
      return new Response(
        JSON.stringify({ error: "Failed to create service request", details: orderError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Service request created successfully:", order.order_number);

    // Send service-specific notification (fire and forget)
    try {
      await supabase.functions.invoke("send-service-notification", {
        body: {
          serviceNumber: order.order_number,
          serviceType: payload.serviceType,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          town: order.town,
          pickupLocation: payload.pickupLocation,
          dropoffLocation: payload.dropoffLocation,
          description: payload.description,
          optionalMessage: payload.optionalMessage,
          paymentMethod: order.payment_method,
        },
      });
      console.log("Service notification sent successfully");
    } catch (notifError) {
      console.error("Failed to send service notification:", notifError);
      // Don't fail the request if notification fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        serviceNumber: order.order_number,
        message: "Service request submitted successfully. We'll contact you shortly.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
