import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { config } from '@/lib/config';

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const functionsBaseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  const fnFetch = async (path: string, init?: RequestInit) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
      ...(anonKey ? { Authorization: `Bearer ${anonKey}` } : {}),
    };
    const res = await fetch(`${functionsBaseUrl}${path}`, { ...init, headers });
    const data = await res.json().catch(() => ({}));
    return { res, data } as const;
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // New custom auth calling Edge Functions
  const customSignUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { res, data } = await fnFetch('/auth-signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName })
      });
      if (!res.ok || !data.success) {
        return { error: new Error(data?.error || 'Signup failed') };
      }
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err?.message || 'Signup failed') };
    }
  };

  const customSignIn = async (email: string, password: string) => {
    try {
      const { res, data } = await fnFetch('/auth-login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (!res.ok || !data.success) {
        return { error: new Error(data?.error || 'Login failed'), token: undefined };
      }
      localStorage.setItem('auth_token', data.token);
      return { error: null, token: data.token };
    } catch (err: any) {
      return { error: new Error(err?.message || 'Login failed'), token: undefined };
    }
  };

  const sendOrderStatusEmail = async (payload: {
    toEmail: string;
    orderNumber: string;
    customerName: string;
    customerPhone?: string;
    deliveryAddress?: string;
    items: Array<{ name: string; restaurant?: string; quantity: number; price: number }>;
    subtotal: number;
    deliveryFee: number;
    total: number;
    oldStatus?: string;
    newStatus: string;
    notificationType: 'success' | 'failed' | 'pending_long' | 'status_update' | 'out_for_delivery' | 'delivered' | 'cancelled';
    paymentReference?: string;
    notes?: string;
    createdAt?: string;
  }) => {
    try {
      const { res, data } = await fnFetch('/send-status-notification', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (!res.ok || !data.success) {
        return { error: new Error(data?.error || 'Email send failed') };
      }
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err?.message || 'Email send failed') };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setProfile(null);
      localStorage.removeItem('auth_token');
    }
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);
    
    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }
    
    return { error };
  };

  return {
    user,
    session,
    profile,
    loading,
    // new custom auth only
    customSignUp,
    customSignIn,
    sendOrderStatusEmail,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    refetchProfile: () => user ? fetchProfile(user.id) : Promise.resolve()
  };
};