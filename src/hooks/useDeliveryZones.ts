import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DeliveryZone {
  id: string;
  town: string;
  zone_name: string;
  delivery_fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useDeliveryZones = (town?: string) => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("delivery_zones")
        .select("*")
        .eq("is_active", true);
      
      if (town) {
        query = query.eq("town", town);
      }
      
      const { data, error } = await query.order("zone_name");

      if (error) throw error;
      setZones(data || []);
    } catch (err) {
      console.error("Error fetching delivery zones:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch delivery zones");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllZones = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("delivery_zones")
        .select("*")
        .order("town", { ascending: true })
        .order("zone_name", { ascending: true });

      if (error) throw error;
      setZones(data || []);
    } catch (err) {
      console.error("Error fetching all delivery zones:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch delivery zones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [town]);

  return { 
    zones, 
    loading, 
    error, 
    refetch: fetchZones,
    fetchAllZones
  };
};