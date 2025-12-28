import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "./useAdminAuth";

export type AdminZone = "operations" | "finance" | "insights";

export type AdminRole = "admin" | "admin_operations" | "admin_finance" | "admin_insights";

interface ZonePermissions {
  canAccessOperations: boolean;
  canAccessFinance: boolean;
  canAccessInsights: boolean;
  isSuperAdmin: boolean;
  availableZones: AdminZone[];
  userRoles: AdminRole[];
}

export const useAdminZones = () => {
  const { user, isAdmin } = useAdminAuth();
  const [permissions, setPermissions] = useState<ZonePermissions>({
    canAccessOperations: false,
    canAccessFinance: false,
    canAccessInsights: false,
    isSuperAdmin: false,
    availableZones: [],
    userRoles: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentZone, setCurrentZone] = useState<AdminZone>("operations");

  useEffect(() => {
    if (user) {
      fetchUserRoles(user.id);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) throw error;

      const roles = (data || []).map((r) => r.role as AdminRole);
      
      const isSuperAdmin = roles.includes("admin");
      const canAccessOperations = isSuperAdmin || roles.includes("admin_operations");
      const canAccessFinance = isSuperAdmin || roles.includes("admin_finance");
      const canAccessInsights = isSuperAdmin || roles.includes("admin_insights") || canAccessOperations || canAccessFinance;

      const availableZones: AdminZone[] = [];
      if (canAccessOperations) availableZones.push("operations");
      if (canAccessFinance) availableZones.push("finance");
      if (canAccessInsights) availableZones.push("insights");

      setPermissions({
        canAccessOperations,
        canAccessFinance,
        canAccessInsights,
        isSuperAdmin,
        availableZones,
        userRoles: roles,
      });

      // Set default zone based on available permissions
      if (availableZones.length > 0 && !availableZones.includes(currentZone)) {
        setCurrentZone(availableZones[0]);
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...permissions,
    loading,
    currentZone,
    setCurrentZone,
  };
};
