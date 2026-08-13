import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type RiderStatus = "available" | "busy" | "offline";

export interface RiderOps {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  whatsapp_number: string | null;
  is_active: boolean;
  current_status: RiderStatus;
  notes: string | null;
  auto_assign_enabled: boolean | null;
  active_orders_count: number | null;
  max_active_orders: number | null;
  total_completed_orders: number | null;
  average_rating: number | null;
  last_seen: string | null;
  created_at: string;
  updated_at: string;
}

export interface RiderLocation {
  id: string;
  name: string;
  phone: string;
  current_status: RiderStatus;
  active_orders_count: number;
  max_active_orders: number;
  last_seen: string | null;
  lat: number | null;
  lng: number | null;
}

export const useRiderOps = () => {
  const [riders, setRiders] = useState<RiderOps[]>([]);
  const [locations, setLocations] = useState<RiderLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRiders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("riders")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      setRiders((data as unknown as RiderOps[]) || []);
    } catch (err) {
      console.error("Error fetching riders:", err);
      toast({ title: "Error", description: "Failed to load riders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchLocations = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc("get_rider_locations");
      if (error) throw error;
      setLocations((data as unknown as RiderLocation[]) || []);
    } catch (err) {
      console.error("Error fetching rider locations:", err);
    }
  }, []);

  const updateRider = useCallback(
    async (id: string, updates: Partial<RiderOps>) => {
      const { error } = await supabase.from("riders").update(updates).eq("id", id);
      if (error) {
        toast({ title: "Error", description: "Could not update rider", variant: "destructive" });
        return false;
      }
      setRiders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
      toast({ title: "Rider updated" });
      return true;
    },
    [toast]
  );

  const createRider = useCallback(
    async (input: { name: string; phone: string; email?: string; whatsapp_number?: string }) => {
      const { data, error } = await supabase
        .from("riders")
        .insert({
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          whatsapp_number: input.whatsapp_number || input.phone,
        })
        .select()
        .single();
      if (error) {
        toast({ title: "Error", description: "Could not add rider", variant: "destructive" });
        return null;
      }
      toast({ title: "Rider added" });
      await fetchRiders();
      return data as unknown as RiderOps;
    },
    [fetchRiders, toast]
  );

  useEffect(() => {
    fetchRiders();
    fetchLocations();
  }, [fetchRiders, fetchLocations]);

  // Live updates on rider changes
  useEffect(() => {
    const channel = supabase
      .channel("rider-ops")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "riders" },
        () => {
          fetchRiders();
          fetchLocations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRiders, fetchLocations]);

  return {
    riders,
    locations,
    loading,
    refetch: async () => {
      await Promise.all([fetchRiders(), fetchLocations()]);
    },
    updateRider,
    createRider,
  };
};
