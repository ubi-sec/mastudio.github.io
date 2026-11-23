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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_allowlist: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          created_at: string
          customer_id: string | null
          email: string
          event_date: string | null
          full_name: string
          id: string
          internal_notes: string
          location: string | null
          message: string | null
          phone: string
          service_type: string
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          email: string
          event_date?: string | null
          full_name: string
          id?: string
          internal_notes?: string
          location?: string | null
          message?: string | null
          phone: string
          service_type: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          email?: string
          event_date?: string | null
          full_name?: string
          id?: string
          internal_notes?: string
          location?: string | null
          message?: string | null
          phone?: string
          service_type?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string
          email: string
          event_date: string | null
          event_location: string
          event_type: string
          id: string
          notes: string
          package_name: string
          package_price: number | null
          phone: string
          source: string
          source_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name: string
          email?: string
          event_date?: string | null
          event_location?: string
          event_type?: string
          id?: string
          notes?: string
          package_name?: string
          package_price?: number | null
          phone?: string
          source?: string
          source_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          email?: string
          event_date?: string | null
          event_location?: string
          event_type?: string
          id?: string
          notes?: string
          package_name?: string
          package_price?: number | null
          phone?: string
          source?: string
          source_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
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
          email: string
          full_name: string
          id: string
          notes: string
          phone: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name: string
          id?: string
          notes?: string
          phone?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string
          phone?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          expense_date: string
          id: string
          notes: string
          receipt_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          expense_date?: string
          id?: string
          notes?: string
          receipt_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          expense_date?: string
          id?: string
          notes?: string
          receipt_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          category: string
          created_at: string
          description: string
          featured: boolean
          id: string
          image_path: string
          published: boolean
          shape: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_path: string
          published?: boolean
          shape?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_path?: string
          published?: boolean
          shape?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          description: string
          id: string
          invoice_id: string
          kind: string
          quantity: number
          sort_order: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          kind?: string
          quantity?: number
          sort_order?: number
          unit_price?: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          kind?: string
          quantity?: number
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          is_advance: boolean
          method: string
          note: string
          paid_on: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          is_advance?: boolean
          method?: string
          note?: string
          paid_on?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          is_advance?: boolean
          method?: string
          note?: string
          paid_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          balance: number
          booking_id: string | null
          created_at: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          discount: number
          due_date: string | null
          event_date: string | null
          event_location: string
          event_type: string
          id: string
          invoice_date: string
          invoice_number: string
          notes: string
          package_name: string
          package_price: number
          payment_method: string | null
          payment_status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          balance?: number
          booking_id?: string | null
          created_at?: string
          customer_email?: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string
          discount?: number
          due_date?: string | null
          event_date?: string | null
          event_location?: string
          event_type?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string
          package_name?: string
          package_price?: number
          payment_method?: string | null
          payment_status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          balance?: number
          booking_id?: string | null
          created_at?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          discount?: number
          due_date?: string | null
          event_date?: string | null
          event_location?: string
          event_type?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string
          package_name?: string
          package_price?: number
          payment_method?: string | null
          payment_status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      package_inquiries: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string
          email: string
          event_date: string | null
          event_location: string | null
          event_type: string
          id: string
          internal_notes: string
          package_name: string
          phone: string
          requirements: string | null
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name: string
          email: string
          event_date?: string | null
          event_location?: string | null
          event_type: string
          id?: string
          internal_notes?: string
          package_name: string
          phone: string
          requirements?: string | null
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          email?: string
          event_date?: string | null
          event_location?: string | null
          event_type?: string
          id?: string
          internal_notes?: string
          package_name?: string
          phone?: string
          requirements?: string | null
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_inquiries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          active: boolean
          created_at: string
          description: string
          features: string[]
          id: string
          name: string
          popular: boolean
          price: number | null
          price_note: string
          slug: string
          sort_order: number
          tier: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          name: string
          popular?: boolean
          price?: number | null
          price_note?: string
          slug: string
          sort_order?: number
          tier?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          name?: string
          popular?: boolean
          price?: number | null
          price_note?: string
          slug?: string
          sort_order?: number
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_images: {
        Row: {
          alt: string
          created_at: string
          id: string
          image_path: string
          project_id: string
          sort_order: number
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          image_path: string
          project_id: string
          sort_order?: number
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          image_path?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          category: string
          cover_path: string | null
          created_at: string
          deliverables: string[]
          id: string
          location: string
          project_date: string | null
          published: boolean
          slug: string
          sort_order: number
          story: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          cover_path?: string | null
          created_at?: string
          deliverables?: string[]
          id?: string
          location?: string
          project_date?: string | null
          published?: boolean
          slug: string
          sort_order?: number
          story?: string
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_path?: string | null
          created_at?: string
          deliverables?: string[]
          id?: string
          location?: string
          project_date?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          story?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_heading: string
          about_intro: string
          default_tax_rate: number
          email: string
          footer_signature: string
          footer_text: string
          gallery_categories: string[]
          hero_description: string
          hero_heading: string
          hero_image_path: string | null
          hero_tagline: string
          id: number
          invoice_footer_note: string
          invoice_payment_terms: string
          location: string
          logo_path: string | null
          phone_display: string
          socials: Json
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          about_heading?: string
          about_intro?: string
          default_tax_rate?: number
          email?: string
          footer_signature?: string
          footer_text?: string
          gallery_categories?: string[]
          hero_description?: string
          hero_heading?: string
          hero_image_path?: string | null
          hero_tagline?: string
          id?: number
          invoice_footer_note?: string
          invoice_payment_terms?: string
          location?: string
          logo_path?: string | null
          phone_display?: string
          socials?: Json
          updated_at?: string
          whatsapp_number?: string
        }
        Update: {
          about_heading?: string
          about_intro?: string
          default_tax_rate?: number
          email?: string
          footer_signature?: string
          footer_text?: string
          gallery_categories?: string[]
          hero_description?: string
          hero_heading?: string
          hero_image_path?: string | null
          hero_tagline?: string
          id?: number
          invoice_footer_note?: string
          invoice_payment_terms?: string
          location?: string
          logo_path?: string | null
          phone_display?: string
          socials?: Json
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      convert_inquiry_to_booking: {
        Args: { _id: string; _kind: string }
        Returns: string
      }
      find_or_create_customer: {
        Args: { _email: string; _name: string; _phone: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_public_media: { Args: { _path: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
    },
  },
} as const
