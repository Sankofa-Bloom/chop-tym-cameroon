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
      customer_locations: {
        Row: {
          address: string | null
          created_at: string | null
          customer_id: string
          id: string
          is_default: boolean | null
          landmark: string | null
          location: unknown
          location_name: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          is_default?: boolean | null
          landmark?: string | null
          location?: unknown
          location_name: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          is_default?: boolean | null
          landmark?: string | null
          location?: unknown
          location_name?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_locations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_sessions: {
        Row: {
          channel: string
          created_at: string | null
          current_state: string
          customer_id: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          phone: string
          temporary_data: Json | null
          updated_at: string | null
        }
        Insert: {
          channel?: string
          created_at?: string | null
          current_state: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          phone: string
          temporary_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          current_state?: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string
          temporary_data?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          last_order_at: string | null
          notes: string | null
          phone: string
          preferences: Json
          preferred_language: string
          preferred_name: string | null
          preferred_payment_method: string | null
          total_orders: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          last_order_at?: string | null
          notes?: string | null
          phone: string
          preferences?: Json
          preferred_language?: string
          preferred_name?: string | null
          preferred_payment_method?: string | null
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          last_order_at?: string | null
          notes?: string | null
          phone?: string
          preferences?: Json
          preferred_language?: string
          preferred_name?: string | null
          preferred_payment_method?: string | null
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_routes: {
        Row: {
          average_delivery_time: number | null
          average_fee: number | null
          destination_zone_id: string | null
          id: string
          origin_zone_id: string | null
          total_deliveries: number | null
          updated_at: string | null
        }
        Insert: {
          average_delivery_time?: number | null
          average_fee?: number | null
          destination_zone_id?: string | null
          id?: string
          origin_zone_id?: string | null
          total_deliveries?: number | null
          updated_at?: string | null
        }
        Update: {
          average_delivery_time?: number | null
          average_fee?: number | null
          destination_zone_id?: string | null
          id?: string
          origin_zone_id?: string | null
          total_deliveries?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_routes_destination_zone_id_fkey"
            columns: ["destination_zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_routes_origin_zone_id_fkey"
            columns: ["origin_zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          boundary: unknown
          center_point: unknown
          created_at: string
          delivery_fee: number
          id: string
          is_active: boolean
          total_orders: number | null
          total_revenue: number | null
          town: string
          updated_at: string
          zone_name: string
        }
        Insert: {
          boundary?: unknown
          center_point?: unknown
          created_at?: string
          delivery_fee?: number
          id?: string
          is_active?: boolean
          total_orders?: number | null
          total_revenue?: number | null
          town: string
          updated_at?: string
          zone_name: string
        }
        Update: {
          boundary?: unknown
          center_point?: unknown
          created_at?: string
          delivery_fee?: number
          id?: string
          is_active?: boolean
          total_orders?: number | null
          total_revenue?: number | null
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
          customer_id: string | null
          customer_language: string | null
          customer_name: string
          customer_phone: string
          deleted_at: string | null
          deleted_by: string | null
          delivered_at: string | null
          description: string | null
          dropoff_landmark: string | null
          dropoff_location: string
          dropoff_notes: string | null
          dropoff_point: unknown
          estimated_amount: number
          estimated_distance_km: number | null
          estimated_duration_minutes: number | null
          id: string
          is_deleted: boolean
          order_source: Database["public"]["Enums"]["operational_order_source"]
          order_type: Database["public"]["Enums"]["operational_order_type"]
          payment_method: string
          payment_status: string
          picked_up_at: string | null
          pickup_landmark: string | null
          pickup_location: string
          pickup_notes: string | null
          pickup_point: unknown
          reference_id: string
          rider_assigned_at: string | null
          route_data: Json | null
          status: Database["public"]["Enums"]["operational_order_status"]
          town: string
          updated_at: string
          whatsapp_thread_id: string | null
        }
        Insert: {
          actual_amount?: number | null
          assigned_rider_id?: string | null
          created_at?: string
          created_by: string
          customer_id?: string | null
          customer_language?: string | null
          customer_name: string
          customer_phone: string
          deleted_at?: string | null
          deleted_by?: string | null
          delivered_at?: string | null
          description?: string | null
          dropoff_landmark?: string | null
          dropoff_location: string
          dropoff_notes?: string | null
          dropoff_point?: unknown
          estimated_amount?: number
          estimated_distance_km?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          is_deleted?: boolean
          order_source: Database["public"]["Enums"]["operational_order_source"]
          order_type: Database["public"]["Enums"]["operational_order_type"]
          payment_method?: string
          payment_status?: string
          picked_up_at?: string | null
          pickup_landmark?: string | null
          pickup_location: string
          pickup_notes?: string | null
          pickup_point?: unknown
          reference_id: string
          rider_assigned_at?: string | null
          route_data?: Json | null
          status?: Database["public"]["Enums"]["operational_order_status"]
          town?: string
          updated_at?: string
          whatsapp_thread_id?: string | null
        }
        Update: {
          actual_amount?: number | null
          assigned_rider_id?: string | null
          created_at?: string
          created_by?: string
          customer_id?: string | null
          customer_language?: string | null
          customer_name?: string
          customer_phone?: string
          deleted_at?: string | null
          deleted_by?: string | null
          delivered_at?: string | null
          description?: string | null
          dropoff_landmark?: string | null
          dropoff_location?: string
          dropoff_notes?: string | null
          dropoff_point?: unknown
          estimated_amount?: number
          estimated_distance_km?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          is_deleted?: boolean
          order_source?: Database["public"]["Enums"]["operational_order_source"]
          order_type?: Database["public"]["Enums"]["operational_order_type"]
          payment_method?: string
          payment_status?: string
          picked_up_at?: string | null
          pickup_landmark?: string | null
          pickup_location?: string
          pickup_notes?: string | null
          pickup_point?: unknown
          reference_id?: string
          rider_assigned_at?: string | null
          route_data?: Json | null
          status?: Database["public"]["Enums"]["operational_order_status"]
          town?: string
          updated_at?: string
          whatsapp_thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_orders_assigned_rider_id_fkey"
            columns: ["assigned_rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
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
      order_locations: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          landmark: string | null
          location: unknown
          location_type: string
          notes: string | null
          operational_order_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          landmark?: string | null
          location?: unknown
          location_type: string
          notes?: string | null
          operational_order_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          landmark?: string | null
          location?: unknown
          location_type?: string
          notes?: string | null
          operational_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_locations_operational_order_id_fkey"
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
      rider_assignment_logs: {
        Row: {
          accepted: boolean | null
          assignment_method: string
          created_at: string | null
          id: string
          notes: string | null
          operational_order_id: string
          response_time_seconds: number | null
          rider_id: string
        }
        Insert: {
          accepted?: boolean | null
          assignment_method: string
          created_at?: string | null
          id?: string
          notes?: string | null
          operational_order_id: string
          response_time_seconds?: number | null
          rider_id: string
        }
        Update: {
          accepted?: boolean | null
          assignment_method?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          operational_order_id?: string
          response_time_seconds?: number | null
          rider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rider_assignment_logs_operational_order_id_fkey"
            columns: ["operational_order_id"]
            isOneToOne: false
            referencedRelation: "operational_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rider_assignment_logs_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_location_history: {
        Row: {
          battery_level: number | null
          id: string
          location: unknown
          recorded_at: string | null
          rider_id: string
          speed: number | null
        }
        Insert: {
          battery_level?: number | null
          id?: string
          location: unknown
          recorded_at?: string | null
          rider_id: string
          speed?: number | null
        }
        Update: {
          battery_level?: number | null
          id?: string
          location?: unknown
          recorded_at?: string | null
          rider_id?: string
          speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rider_location_history_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      riders: {
        Row: {
          active_orders_count: number | null
          auto_assign_enabled: boolean | null
          average_rating: number | null
          created_at: string
          current_location: unknown
          current_status: Database["public"]["Enums"]["rider_status"]
          email: string | null
          id: string
          is_active: boolean
          last_seen: string | null
          max_active_orders: number | null
          name: string
          notes: string | null
          phone: string
          total_completed_orders: number | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          active_orders_count?: number | null
          auto_assign_enabled?: boolean | null
          average_rating?: number | null
          created_at?: string
          current_location?: unknown
          current_status?: Database["public"]["Enums"]["rider_status"]
          email?: string | null
          id?: string
          is_active?: boolean
          last_seen?: string | null
          max_active_orders?: number | null
          name: string
          notes?: string | null
          phone: string
          total_completed_orders?: number | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          active_orders_count?: number | null
          auto_assign_enabled?: boolean | null
          average_rating?: number | null
          created_at?: string
          current_location?: unknown
          current_status?: Database["public"]["Enums"]["rider_status"]
          email?: string | null
          id?: string
          is_active?: boolean
          last_seen?: string | null
          max_active_orders?: number | null
          name?: string
          notes?: string | null
          phone?: string
          total_completed_orders?: number | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
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
      whatsapp_messages: {
        Row: {
          content: string | null
          created_at: string | null
          customer_id: string | null
          direction: string
          id: string
          message_type: string
          metadata: Json | null
          operational_order_id: string | null
          status: string | null
          whatsapp_message_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          customer_id?: string | null
          direction: string
          id?: string
          message_type: string
          metadata?: Json | null
          operational_order_id?: string | null
          status?: string | null
          whatsapp_message_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          customer_id?: string | null
          direction?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          operational_order_id?: string | null
          status?: string | null
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_operational_order_id_fkey"
            columns: ["operational_order_id"]
            isOneToOne: false
            referencedRelation: "operational_orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      create_admin_user_role: { Args: { user_id: string }; Returns: undefined }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      generate_operational_order_reference: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      generate_town_order_number: {
        Args: { order_town: string }
        Returns: string
      }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      gettransactionid: { Args: never; Returns: unknown }
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
      longtransactionsenabled: { Args: never; Returns: boolean }
      make_user_admin: { Args: never; Returns: undefined }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
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
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
