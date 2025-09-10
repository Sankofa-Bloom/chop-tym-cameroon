import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Town {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTowns = () => {
  const [towns, setTowns] = useState<Town[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTowns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("towns" as any)
        .select("*")
        .order("name");

      if (error) throw error;
      setTowns(data as unknown as Town[] || []);
    } catch (err) {
      console.error("Error fetching towns:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch towns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTowns();
  }, []);

  return { towns, loading, error, refetch: fetchTowns };
};