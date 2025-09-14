import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Street {
  id: string;
  name: string;
  delivery_zone_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useStreets = (town?: string) => {
  const [streets, setStreets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreets = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("streets")
        .select(`
          *,
          delivery_zone:delivery_zones(
            id,
            zone_name,
            town,
            delivery_fee
          )
        `)
        .eq("is_active", true);
      
      if (town) {
        query = query.eq("delivery_zone.town", town);
      }
      
      const { data, error } = await query.order("name");

      if (error) throw error;
      setStreets(data || []);
    } catch (err) {
      console.error("Error fetching streets:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch streets");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStreets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("streets")
        .select(`
          *,
          delivery_zone:delivery_zones(
            id,
            zone_name,
            town,
            delivery_fee
          )
        `)
        .order("name");

      if (error) throw error;
      setStreets(data || []);
    } catch (err) {
      console.error("Error fetching all streets:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch streets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreets();
  }, [town]);

  return { 
    streets, 
    loading, 
    error, 
    refetch: fetchStreets,
    fetchAllStreets
  };
};