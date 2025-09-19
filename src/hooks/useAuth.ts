import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';


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

  // Helper to call Edge Functions safely via Supabase client
  const invoke = async <T = any>(name: string, body?: any) => {
    const { data, error } = await supabase.functions.invoke(name, {
      body,
    });
    return { data: data as T, error } as const;
  };
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
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

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });

    if (error) {
      return { error };
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    return { error: null };
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
      const { data, error } = await invoke<{ success?: boolean; error?: string }>('send-status-notification', payload);
      if (error || !data?.success) {
        return { error: new Error(data?.error || error?.message || 'Email send failed') };
      }
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err?.message || 'Email send failed') };
    }
  };

  const createPaymentAndRedirect = async (args: {
    orderNumber: string;
    amount: number;
    currency?: string;
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    description?: string;
    metadata?: Record<string, unknown>;
    paymentMethod?: 'swychr' | 'offline';
  }) => {
    const { data, error } = await invoke<{ success?: boolean; payment_url?: string; error?: string }>('swychr-create-payment', {
      amount: args.amount,
      customer_phone: args.customerPhone,
      customer_name: args.customerName,
      customer_email: args.customerEmail,
      order_id: args.orderNumber,
      description: args.description,
      orderData: args.metadata?.orderData
    });
    if (error || !data?.success || !data.payment_url) {
      return { error: new Error(data?.error || error?.message || 'Failed to create Swychr payment') };
    }
    window.location.href = data.payment_url as string;
    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setProfile(null);
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
    signUp,
    signIn,
    sendOrderStatusEmail,
    createPaymentAndRedirect,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    refetchProfile: () => user ? fetchProfile(user.id) : Promise.resolve()
  };
};