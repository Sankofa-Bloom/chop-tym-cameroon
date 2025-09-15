export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      auth_users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_verified: boolean
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_verified?: boolean
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean
          password_hash?: string
        }
        Relationships: []
      }
      complements: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          created_at: string
          delivery_fee: number
          id: string
          is_active: boolean
          town: string
          updated_at: string
          zone_name: string
        }
        Insert: {
          created_at?: string
          delivery_fee?: number
          id?: string
          is_active?: boolean
          town: string
          updated_at?: string
          zone_name: string
        }
        Update: {
          created_at?: string
          delivery_fee?: number
          id?: string
          is_active?: boolean
          town?: string
          updated_at?: string
          zone_name?: string
        }
        Relationships: []
      }
      dish_complements: {
        Row: {
          complement_id: string
          created_at: string
          dish_id: string
          id: string
          is_required: boolean
          max_quantity: number | null
          updated_at: string
        }
        Insert: {
          complement_id: string
          created_at?: string
          dish_id: string
          id?: string
          is_required?: boolean
          max_quantity?: number | null
          updated_at?: string
        }
        Update: {
          complement_id?: string
          created_at?: string
          dish_id?: string
          id?: string
          is_required?: boolean
          max_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dish_complements_complement_id_fkey"
            columns: ["complement_id"]
            isOneToOne: false
            referencedRelation: "complements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_complements_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_verification_tokens: {
        Row: {
          created_at: string
          expires_at: string
          token: string
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          token: string
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          token?: string
          used?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_verification_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_fee: number
          id: string
          items: Json
          notes: string | null
          order_number: string
          payment_method: string
          payment_reference: string | null
          payment_status: string
          subtotal: number
          total: number
          town: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_fee: number
          id?: string
          items: Json
          notes?: string | null
          order_number: string
          payment_method?: string
          payment_reference?: string | null
          payment_status?: string
          subtotal: number
          total: number
          town?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          delivery_fee?: number
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payment_method?: string
          payment_reference?: string | null
          payment_status?: string
          subtotal?: number
          total?: number
          town?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      restaurant_dishes: {
        Row: {
          available_days: number[] | null
          available_from: string | null
          available_until: string | null
          created_at: string
          currency: string
          dish_id: string
          id: string
          is_available: boolean | null
          price: number
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          available_days?: number[] | null
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          currency?: string
          dish_id: string
          id?: string
          is_available?: boolean | null
          price: number
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          available_days?: number[] | null
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          currency?: string
          dish_id?: string
          id?: string
          is_available?: boolean | null
          price?: number
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_dishes_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_dishes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          closes_at: string | null
          created_at: string
          delivery_time: string | null
          description: string | null
          exact_location: string | null
          id: string
          image_url: string | null
          is_open_now: boolean | null
          is_popular: boolean | null
          name: string
          opens_at: string | null
          operating_days: number[] | null
          phone: string | null
          popular_order: number | null
          rating: number | null
          town: string
          updated_at: string
        }
        Insert: {
          closes_at?: string | null
          created_at?: string
          delivery_time?: string | null
          description?: string | null
          exact_location?: string | null
          id?: string
          image_url?: string | null
          is_open_now?: boolean | null
          is_popular?: boolean | null
          name: string
          opens_at?: string | null
          operating_days?: number[] | null
          phone?: string | null
          popular_order?: number | null
          rating?: number | null
          town?: string
          updated_at?: string
        }
        Update: {
          closes_at?: string | null
          created_at?: string
          delivery_time?: string | null
          description?: string | null
          exact_location?: string | null
          id?: string
          image_url?: string | null
          is_open_now?: boolean | null
          is_popular?: boolean | null
          name?: string
          opens_at?: string | null
          operating_days?: number[] | null
          phone?: string | null
          popular_order?: number | null
          rating?: number | null
          town?: string
          updated_at?: string
        }
        Relationships: []
      }
      streets: {
        Row: {
          created_at: string
          delivery_zone_id: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_zone_id: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_zone_id?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "streets_delivery_zone_id_fkey"
            columns: ["delivery_zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      town_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          town: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          town: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          town?: string
        }
        Relationships: []
      }
      towns: {
        Row: {
          created_at: string
          free_delivery: boolean
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          free_delivery?: boolean
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          free_delivery?: boolean
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user_role: {
        Args: { user_id: string }
        Returns: undefined
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_town_order_number: {
        Args: { order_town: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_restaurant_open: {
        Args: {
          restaurant_row: Database["public"]["Tables"]["restaurants"]["Row"]
        }
        Returns: boolean
      }
      make_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
