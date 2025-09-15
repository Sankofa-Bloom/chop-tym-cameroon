import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const functionsBaseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      setIsAdmin(!!data);
    } catch (err) {
      console.error("Error checking admin status:", err);
      setError("Failed to verify admin permissions");
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
        
        if (!session?.user) {
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use Supabase Edge Functions client so the required Authorization header is included
      const { data, error } = await supabase.functions.invoke('auth-login', {
        body: { email, password },
      });

      if (error || !data?.success) {
        throw new Error((data as any)?.error || error?.message || 'Sign in failed');
      }

      localStorage.setItem('auth_token', data.token);
      // Note: This token is not a Supabase session; admin checks rely on Supabase auth.
      // If you prefer native Supabase auth, we can switch to supabase.auth.signInWithPassword.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAdmin(false);
  };

  return {
    user,
    isAdmin,
    loading,
    error,
    signIn,
    signOut
  };
};