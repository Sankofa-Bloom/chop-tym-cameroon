import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  icon_url?: string;
  fees?: string;
  processing_time?: string;
}

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setPaymentMethods(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch payment methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
    loading,
    error,
    refetch: fetchPaymentMethods,
  };
};