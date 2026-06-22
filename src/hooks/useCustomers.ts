import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Customer = {
  id: string;
  phone: string;
  preferred_name: string | null;
  preferred_language: string;
  email: string | null;
  preferred_payment_method: string | null;
  notes: string | null;
  preferences: any;
  total_orders: number;
  total_spent: number;
  is_active: boolean;
  last_order_at: string | null;
  created_at: string;
  updated_at: string;
};

export function useCustomers(search: string = "") {
  return useQuery({
    queryKey: ["customers", search],
    queryFn: async () => {
      let q = supabase
        .from("customers")
        .select("*")
        .order("last_order_at", { ascending: false, nullsFirst: false })
        .limit(200);
      if (search.trim()) {
        const s = `%${search.trim()}%`;
        q = q.or(`phone.ilike.${s},preferred_name.ilike.${s},email.ilike.${s}`);
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Customer[];
    },
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ["customer", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as Customer | null;
    },
  });
}

export function useCustomerLocations(customerId: string | undefined) {
  return useQuery({
    queryKey: ["customer_locations", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_locations")
        .select("*")
        .eq("customer_id", customerId!)
        .order("is_default", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCustomerOrders(customerId: string | undefined, phone: string | undefined) {
  return useQuery({
    queryKey: ["customer_orders", customerId, phone],
    enabled: !!(customerId || phone),
    queryFn: async () => {
      let q = supabase
        .from("operational_orders")
        .select("id,reference_id,order_type,status,estimated_amount,actual_amount,pickup_location,dropoff_location,created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (phone) q = q.eq("customer_phone", phone);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export type WhatsAppSession = {
  id: string;
  customer_id: string | null;
  phone: string;
  channel: string;
  current_state: string;
  temporary_data: any;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export function useCustomerSessions() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("customer_sessions")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(100);
      if (active) {
        setSessions((data ?? []) as WhatsAppSession[]);
        setLoading(false);
      }
    };
    load();

    const channel = supabase
      .channel("customer_sessions_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "customer_sessions" }, () => load())
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { sessions, loading };
}

export type WhatsAppMessage = {
  id: string;
  customer_id: string | null;
  operational_order_id: string | null;
  direction: string;
  message_type: string;
  whatsapp_message_id: string | null;
  content: string | null;
  metadata: any;
  status: string | null;
  created_at: string;
};

export function useWhatsAppMessages(customerId: string | undefined) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);

  useEffect(() => {
    if (!customerId) return;
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: true })
        .limit(200);
      if (active) setMessages((data ?? []) as WhatsAppMessage[]);
    };
    load();

    const channel = supabase
      .channel(`whatsapp_messages_${customerId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "whatsapp_messages", filter: `customer_id=eq.${customerId}` },
        () => load()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [customerId]);

  return messages;
}

export async function resetCustomerSession(sessionId: string) {
  const { error } = await supabase
    .from("customer_sessions")
    .update({ current_state: "idle", temporary_data: {}, is_active: false })
    .eq("id", sessionId);
  if (error) throw error;
}
