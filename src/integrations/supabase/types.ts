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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bridge_listing_links: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_external: boolean | null
          name: string
          parent_id: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          name: string
          parent_id?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          name?: string
          parent_id?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "bridge_listing_links_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "bridge_listing_links"
            referencedColumns: ["id"]
          },
        ]
      }
      bridge_markets: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          slug: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          slug: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          slug?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bridge_pages: {
        Row: {
          content: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          page_slug: string
          section_key: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          page_slug: string
          section_key: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          page_slug?: string
          section_key?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bridge_services: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          path: string
          slug: string
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          path: string
          slug: string
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          path?: string
          slug?: string
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bridge_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_notifications: {
        Row: {
          body: string
          created_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          recipient_email: string
          recipient_name: string | null
          sent_at: string | null
          status: string
          subject: string
          template_type: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template_type?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          approximate_size: string | null
          assignment_type: string | null
          budget: string | null
          budget_range: string | null
          created_at: string | null
          current_situation: string | null
          email: string
          id: string
          inquiry_type: string | null
          matched_properties: Json | null
          name: string
          neighborhoods: string | null
          notes: string | null
          phone: string | null
          property_address: string | null
          property_type: string | null
          requirements: string | null
          status: string | null
          target_asset_type: string | null
          target_boroughs: string | null
          timeline: string | null
          timing: string | null
          unit_count: string | null
          updated_at: string | null
          user_id: string | null
          user_type: string | null
        }
        Insert: {
          approximate_size?: string | null
          assignment_type?: string | null
          budget?: string | null
          budget_range?: string | null
          created_at?: string | null
          current_situation?: string | null
          email: string
          id?: string
          inquiry_type?: string | null
          matched_properties?: Json | null
          name: string
          neighborhoods?: string | null
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          property_type?: string | null
          requirements?: string | null
          status?: string | null
          target_asset_type?: string | null
          target_boroughs?: string | null
          timeline?: string | null
          timing?: string | null
          unit_count?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Update: {
          approximate_size?: string | null
          assignment_type?: string | null
          budget?: string | null
          budget_range?: string | null
          created_at?: string | null
          current_situation?: string | null
          email?: string
          id?: string
          inquiry_type?: string | null
          matched_properties?: Json | null
          name?: string
          neighborhoods?: string | null
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          property_type?: string | null
          requirements?: string | null
          status?: string | null
          target_asset_type?: string | null
          target_boroughs?: string | null
          timeline?: string | null
          timing?: string | null
          unit_count?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_files: {
        Row: {
          alt_text: string | null
          bucket_name: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          metadata: Json | null
          storage_path: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          bucket_name: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          metadata?: Json | null
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          bucket_name?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          metadata?: Json | null
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          asset_type: string | null
          bathrooms: number | null
          bedrooms: number | null
          brief_highlights: string | null
          cap_rate: number | null
          city: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          gross_square_feet: number | null
          id: string
          images: string[] | null
          is_represented_building: boolean | null
          latitude: number | null
          listing_type: string | null
          longitude: number | null
          offering_status: string | null
          price: number
          price_on_request: boolean | null
          property_type: string | null
          square_feet: number | null
          state: string
          status: string | null
          title: string
          units: number | null
          updated_at: string | null
          year_built: number | null
          zip_code: string | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          asset_type?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          brief_highlights?: string | null
          cap_rate?: number | null
          city: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          gross_square_feet?: number | null
          id?: string
          images?: string[] | null
          is_represented_building?: boolean | null
          latitude?: number | null
          listing_type?: string | null
          longitude?: number | null
          offering_status?: string | null
          price: number
          price_on_request?: boolean | null
          property_type?: string | null
          square_feet?: number | null
          state: string
          status?: string | null
          title: string
          units?: number | null
          updated_at?: string | null
          year_built?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          asset_type?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          brief_highlights?: string | null
          cap_rate?: number | null
          city?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          gross_square_feet?: number | null
          id?: string
          images?: string[] | null
          is_represented_building?: boolean | null
          latitude?: number | null
          listing_type?: string | null
          longitude?: number | null
          offering_status?: string | null
          price?: number
          price_on_request?: boolean | null
          property_type?: string | null
          square_feet?: number | null
          state?: string
          status?: string | null
          title?: string
          units?: number | null
          updated_at?: string | null
          year_built?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      property_analytics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          property_id: string
          referrer: string | null
          session_id: string | null
          user_id: string | null
          view_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          property_id: string
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
          view_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          property_id?: string
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
          view_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_analytics_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      research_notes: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          date: string
          download_link: string | null
          id: string
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          date?: string
          download_link?: string | null
          id?: string
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          date?: string
          download_link?: string | null
          id?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          category: string
          created_at: string | null
          display_order: number | null
          email: string
          id: string
          image_url: string | null
          instagram_url: string | null
          is_active: boolean | null
          license_number: string | null
          linkedin_url: string | null
          name: string
          phone: string | null
          slug: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          category: string
          created_at?: string | null
          display_order?: number | null
          email: string
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          license_number?: string | null
          linkedin_url?: string | null
          name: string
          phone?: string | null
          slug?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          category?: string
          created_at?: string | null
          display_order?: number | null
          email?: string
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          license_number?: string | null
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          slug?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tour_requests: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          property_id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_id: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          agent_name: string
          asset_type: string | null
          borough: string | null
          building_id: string | null
          closing_date: string | null
          created_at: string
          deal_type: string
          gross_square_feet: number | null
          id: string
          lease_term_months: number | null
          monthly_rent: number | null
          neighborhood: string | null
          notes: string | null
          price_per_sf: number | null
          price_per_unit: number | null
          property_address: string
          property_type: string | null
          role: string | null
          sale_price: number | null
          total_lease_value: number | null
          units: number | null
          updated_at: string
          year: number | null
        }
        Insert: {
          agent_name: string
          asset_type?: string | null
          borough?: string | null
          building_id?: string | null
          closing_date?: string | null
          created_at?: string
          deal_type?: string
          gross_square_feet?: number | null
          id?: string
          lease_term_months?: number | null
          monthly_rent?: number | null
          neighborhood?: string | null
          notes?: string | null
          price_per_sf?: number | null
          price_per_unit?: number | null
          property_address: string
          property_type?: string | null
          role?: string | null
          sale_price?: number | null
          total_lease_value?: number | null
          units?: number | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          agent_name?: string
          asset_type?: string | null
          borough?: string | null
          building_id?: string | null
          closing_date?: string | null
          created_at?: string
          deal_type?: string
          gross_square_feet?: number | null
          id?: string
          lease_term_months?: number | null
          monthly_rent?: number | null
          neighborhood?: string | null
          notes?: string | null
          price_per_sf?: number | null
          price_per_unit?: number | null
          property_address?: string
          property_type?: string | null
          role?: string | null
          sale_price?: number | null
          total_lease_value?: number | null
          units?: number | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_agent: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "agent" | "user"
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
      app_role: ["admin", "agent", "user"],
    },
  },
} as const
