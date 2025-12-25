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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      bridge_buildings: {
        Row: {
          address: string
          borough: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          neighborhood: string | null
          slug: string
          tags: string[] | null
          unit_count: number | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address: string
          borough?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          neighborhood?: string | null
          slug: string
          tags?: string[] | null
          unit_count?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string
          borough?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          neighborhood?: string | null
          slug?: string
          tags?: string[] | null
          unit_count?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      bridge_calculators: {
        Row: {
          calculator_type: string
          created_at: string | null
          display_order: number | null
          id: string
          input_config: Json | null
          is_active: boolean | null
          output_description: string | null
          section_key: string
          service_slug: string
          slug: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          calculator_type: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          input_config?: Json | null
          is_active?: boolean | null
          output_description?: string | null
          section_key: string
          service_slug: string
          slug: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          calculator_type?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          input_config?: Json | null
          is_active?: boolean | null
          output_description?: string | null
          section_key?: string
          service_slug?: string
          slug?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
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
      bridge_resources: {
        Row: {
          body_content: string | null
          category: string
          created_at: string | null
          display_order: number | null
          external_url: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          short_description: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          body_content?: string | null
          category: string
          created_at?: string | null
          display_order?: number | null
          external_url?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          short_description?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          body_content?: string | null
          category?: string
          created_at?: string | null
          display_order?: number | null
          external_url?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          short_description?: string | null
          slug?: string
          title?: string
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
      commercial_listing_agents: {
        Row: {
          agent_id: string
          created_at: string | null
          display_order: number | null
          id: string
          listing_id: string
          role: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          listing_id: string
          role?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          listing_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commercial_listing_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_listing_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_listing_agents_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "commercial_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      commercial_listings: {
        Row: {
          asking_rent: number | null
          borough: string | null
          building_name: string | null
          ceiling_height_ft: number | null
          created_at: string | null
          description: string | null
          display_order: number | null
          features: string[] | null
          flyer_url: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          latitude: number | null
          lease_term: string | null
          listing_type: string
          longitude: number | null
          neighborhood: string | null
          possession: string | null
          property_address: string
          rent_per_sf: number | null
          square_footage: number
          updated_at: string | null
        }
        Insert: {
          asking_rent?: number | null
          borough?: string | null
          building_name?: string | null
          ceiling_height_ft?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          flyer_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          lease_term?: string | null
          listing_type: string
          longitude?: number | null
          neighborhood?: string | null
          possession?: string | null
          property_address: string
          rent_per_sf?: number | null
          square_footage: number
          updated_at?: string | null
        }
        Update: {
          asking_rent?: number | null
          borough?: string | null
          building_name?: string | null
          ceiling_height_ft?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          flyer_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          lease_term?: string | null
          listing_type?: string
          longitude?: number | null
          neighborhood?: string | null
          possession?: string | null
          property_address?: string
          rent_per_sf?: number | null
          square_footage?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      deal_room_documents: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          document_name: string
          document_url: string | null
          id: string
          is_active: boolean | null
          listing_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          document_name: string
          document_url?: string | null
          id?: string
          is_active?: boolean | null
          listing_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          document_name?: string
          document_url?: string | null
          id?: string
          is_active?: boolean | null
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_room_documents_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "investment_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_room_registrations: {
        Row: {
          access_count: number | null
          brokerage_firm: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          last_accessed_at: string | null
          listing_id: string
          notes: string | null
          phone: string
          registered_at: string
          user_type: string
          working_with: string | null
        }
        Insert: {
          access_count?: number | null
          brokerage_firm?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          last_accessed_at?: string | null
          listing_id: string
          notes?: string | null
          phone: string
          registered_at?: string
          user_type: string
          working_with?: string | null
        }
        Update: {
          access_count?: number | null
          brokerage_firm?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          last_accessed_at?: string | null
          listing_id?: string
          notes?: string | null
          phone?: string
          registered_at?: string
          user_type?: string
          working_with?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          assignment_type: string | null
          budget: string | null
          created_at: string
          email: string
          id: string
          inquiry_type: string | null
          name: string
          neighborhoods: string | null
          notes: string | null
          phone: string | null
          property_address: string | null
          requirements: string | null
          timeline: string | null
          timing: string | null
          unit_count: string | null
          user_type: string | null
        }
        Insert: {
          assignment_type?: string | null
          budget?: string | null
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string | null
          name: string
          neighborhoods?: string | null
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          requirements?: string | null
          timeline?: string | null
          timing?: string | null
          unit_count?: string | null
          user_type?: string | null
        }
        Update: {
          assignment_type?: string | null
          budget?: string | null
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string | null
          name?: string
          neighborhoods?: string | null
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          requirements?: string | null
          timeline?: string | null
          timing?: string | null
          unit_count?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      investment_listing_agents: {
        Row: {
          agent_id: string
          created_at: string | null
          display_order: number | null
          id: string
          listing_id: string
          role: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          listing_id: string
          role?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          listing_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_listing_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_listing_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_listing_agents_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "investment_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_listings: {
        Row: {
          asking_price: number | null
          asset_class: string
          borough: string | null
          cap_rate: number | null
          created_at: string | null
          deal_room_password: string
          description: string | null
          display_order: number | null
          gross_sf: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          listing_agent_id: string | null
          neighborhood: string | null
          om_url: string | null
          property_address: string
          units: number | null
          updated_at: string | null
          year_built: number | null
        }
        Insert: {
          asking_price?: number | null
          asset_class: string
          borough?: string | null
          cap_rate?: number | null
          created_at?: string | null
          deal_room_password?: string
          description?: string | null
          display_order?: number | null
          gross_sf?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          listing_agent_id?: string | null
          neighborhood?: string | null
          om_url?: string | null
          property_address: string
          units?: number | null
          updated_at?: string | null
          year_built?: number | null
        }
        Update: {
          asking_price?: number | null
          asset_class?: string
          borough?: string | null
          cap_rate?: number | null
          created_at?: string | null
          deal_room_password?: string
          description?: string | null
          display_order?: number | null
          gross_sf?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          listing_agent_id?: string | null
          neighborhood?: string | null
          om_url?: string | null
          property_address?: string
          units?: number | null
          updated_at?: string | null
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_listings_listing_agent_id_fkey"
            columns: ["listing_agent_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_listings_listing_agent_id_fkey"
            columns: ["listing_agent_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
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
      transactions: {
        Row: {
          agent_name: string
          asset_type: string | null
          borough: string | null
          building_id: string | null
          closing_date: string | null
          created_at: string
          deal_type: string
          division: string | null
          gross_square_feet: number | null
          id: string
          image_url: string | null
          is_profile_only: boolean
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
          division?: string | null
          gross_square_feet?: number | null
          id?: string
          image_url?: string | null
          is_profile_only?: boolean
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
          division?: string | null
          gross_square_feet?: number | null
          id?: string
          image_url?: string | null
          is_profile_only?: boolean
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
        Relationships: []
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
      team_members_public: {
        Row: {
          bio: string | null
          category: string | null
          display_order: number | null
          email: string | null
          id: string | null
          image_url: string | null
          instagram_url: string | null
          license_number: string | null
          linkedin_url: string | null
          name: string | null
          phone: string | null
          slug: string | null
          title: string | null
        }
        Insert: {
          bio?: string | null
          category?: string | null
          display_order?: number | null
          email?: string | null
          id?: string | null
          image_url?: string | null
          instagram_url?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          name?: string | null
          phone?: string | null
          slug?: string | null
          title?: string | null
        }
        Update: {
          bio?: string | null
          category?: string | null
          display_order?: number | null
          email?: string | null
          id?: string | null
          image_url?: string | null
          instagram_url?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          name?: string | null
          phone?: string | null
          slug?: string | null
          title?: string | null
        }
        Relationships: []
      }
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
