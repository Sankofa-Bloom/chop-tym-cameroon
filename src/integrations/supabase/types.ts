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
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
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
      financial_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency: string
          id: string
          notes: string | null
          order_id: string | null
          payment_method: string | null
          payment_reference: string | null
          status: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_orders: {
        Row: {
          actual_amount: number | null
          assigned_rider_id: string | null
          created_at: string
          created_by: string
          customer_name: string
          customer_phone: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          dropoff_location: string
          estimated_amount: number
          id: string
          is_deleted: boolean
          order_source: Database["public"]["Enums"]["operational_order_source"]
          order_type: Database["public"]["Enums"]["operational_order_type"]
          payment_method: string
          payment_status: string
          pickup_location: string
          reference_id: string
          status: Database["public"]["Enums"]["operational_order_status"]
          town: string
          updated_at: string
        }
        Insert: {
          actual_amount?: number | null
          assigned_rider_id?: string | null
          created_at?: string
          created_by: string
          customer_name: string
          customer_phone: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          dropoff_location: string
          estimated_amount?: number
          id?: string
          is_deleted?: boolean
          order_source: Database["public"]["Enums"]["operational_order_source"]
          order_type: Database["public"]["Enums"]["operational_order_type"]
          payment_method?: string
          payment_status?: string
          pickup_location: string
          reference_id: string
          status?: Database["public"]["Enums"]["operational_order_status"]
          town?: string
          updated_at?: string
        }
        Update: {
          actual_amount?: number | null
          assigned_rider_id?: string | null
          created_at?: string
          created_by?: string
          customer_name?: string
          customer_phone?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          dropoff_location?: string
          estimated_amount?: number
          id?: string
          is_deleted?: boolean
          order_source?: Database["public"]["Enums"]["operational_order_source"]
          order_type?: Database["public"]["Enums"]["operational_order_type"]
          payment_method?: string
          payment_status?: string
          pickup_location?: string
          reference_id?: string
          status?: Database["public"]["Enums"]["operational_order_status"]
          town?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operational_orders_assigned_rider_id_fkey"
            columns: ["assigned_rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_activity_log: {
        Row: {
          action_by: string
          action_type: string
          created_at: string
          id: string
          new_value: Json | null
          notes: string | null
          operational_order_id: string
          previous_value: Json | null
        }
        Insert: {
          action_by: string
          action_type: string
          created_at?: string
          id?: string
          new_value?: Json | null
          notes?: string | null
          operational_order_id: string
          previous_value?: Json | null
        }
        Update: {
          action_by?: string
          action_type?: string
          created_at?: string
          id?: string
          new_value?: Json | null
          notes?: string | null
          operational_order_id?: string
          previous_value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_activity_log_operational_order_id_fkey"
            columns: ["operational_order_id"]
            isOneToOne: false
            referencedRelation: "operational_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_notes: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          note: string
          operational_order_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          note: string
          operational_order_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          note?: string
          operational_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_notes_operational_order_id_fkey"
            columns: ["operational_order_id"]
            isOneToOne: false
            referencedRelation: "operational_orders"
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
      payment_methods: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string | null
          display_order: number
          fees: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          payment_details: Json | null
          processing_time: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          code: string
          created_at?: string
          description?: string | null
          display_order?: number
          fees?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          payment_details?: Json | null
          processing_time?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          display_order?: number
          fees?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          payment_details?: Json | null
          processing_time?: string | null
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
      riders: {
        Row: {
          created_at: string
          current_status: Database["public"]["Enums"]["rider_status"]
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_status?: Database["public"]["Enums"]["rider_status"]
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_status?: Database["public"]["Enums"]["rider_status"]
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string
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
      create_admin_user_role: { Args: { user_id: string }; Returns: undefined }
      generate_operational_order_reference: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      generate_town_order_number: {
        Args: { order_town: string }
        Returns: string
      }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_finance_access: { Args: { user_id?: string }; Returns: boolean }
      has_insights_access: { Args: { user_id?: string }; Returns: boolean }
      has_operations_access: { Args: { user_id?: string }; Returns: boolean }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
      is_any_admin: { Args: { user_id?: string }; Returns: boolean }
      is_restaurant_open: {
        Args: {
          restaurant_row: Database["public"]["Tables"]["restaurants"]["Row"]
        }
        Returns: boolean
      }
      make_user_admin: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role:
        | "admin"
        | "user"
        | "admin_operations"
        | "admin_finance"
        | "admin_insights"
      operational_order_source:
        | "whatsapp"
        | "phone_call"
        | "walk_in"
        | "emergency"
      operational_order_status:
        | "pending"
        | "assigned"
        | "picked_up"
        | "in_transit"
        | "delivered"
        | "cancelled"
        | "failed"
      operational_order_type: "food" | "errand" | "parcel" | "custom"
      rider_status: "available" | "busy" | "offline"
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
      app_role: [
        "admin",
        "user",
        "admin_operations",
        "admin_finance",
        "admin_insights",
      ],
      operational_order_source: [
        "whatsapp",
        "phone_call",
        "walk_in",
        "emergency",
      ],
      operational_order_status: [
        "pending",
        "assigned",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
        "failed",
      ],
      operational_order_type: ["food", "errand", "parcel", "custom"],
      rider_status: ["available", "busy", "offline"],
    },
  },
} as const
