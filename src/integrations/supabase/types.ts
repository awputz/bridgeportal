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
          correlation_id: string | null
          created_at: string | null
          details: Json | null
          duration_ms: number | null
          entity_id: string | null
          entity_type: string | null
          function_name: string | null
          id: string
          ip_address: string | null
          log_level: string | null
          stack_trace: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          correlation_id?: string | null
          created_at?: string | null
          details?: Json | null
          duration_ms?: number | null
          entity_id?: string | null
          entity_type?: string | null
          function_name?: string | null
          id?: string
          ip_address?: string | null
          log_level?: string | null
          stack_trace?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          correlation_id?: string | null
          created_at?: string | null
          details?: Json | null
          duration_ms?: number | null
          entity_id?: string | null
          entity_type?: string | null
          function_name?: string | null
          id?: string
          ip_address?: string | null
          log_level?: string | null
          stack_trace?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          action_url: string | null
          created_at: string
          entity_id: string | null
          id: string
          is_read: boolean
          message: string | null
          priority: string
          title: string
          type: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          priority?: string
          title: string
          type: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          priority?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      agent_applications: {
        Row: {
          admin_notes: string | null
          bio: string | null
          contract_signed: boolean | null
          created_at: string | null
          cultural_values_acknowledged: boolean | null
          date_of_birth: string | null
          divisions: string[]
          email: string
          full_name: string
          headshot_url: string | null
          id: string
          id_photo_url: string | null
          instagram_url: string | null
          license_number: string | null
          linkedin_url: string | null
          mailing_address: string | null
          phone: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string | null
          w9_submitted: boolean | null
        }
        Insert: {
          admin_notes?: string | null
          bio?: string | null
          contract_signed?: boolean | null
          created_at?: string | null
          cultural_values_acknowledged?: boolean | null
          date_of_birth?: string | null
          divisions?: string[]
          email: string
          full_name: string
          headshot_url?: string | null
          id?: string
          id_photo_url?: string | null
          instagram_url?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          mailing_address?: string | null
          phone: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
          w9_submitted?: boolean | null
        }
        Update: {
          admin_notes?: string | null
          bio?: string | null
          contract_signed?: boolean | null
          created_at?: string | null
          cultural_values_acknowledged?: boolean | null
          date_of_birth?: string | null
          divisions?: string[]
          email?: string
          full_name?: string
          headshot_url?: string | null
          id?: string
          id_photo_url?: string | null
          instagram_url?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          mailing_address?: string | null
          phone?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
          w9_submitted?: boolean | null
        }
        Relationships: []
      }
      agent_metrics: {
        Row: {
          activities_completed: number | null
          agent_id: string
          contacts_added: number | null
          created_at: string | null
          deals_closed: number | null
          division: string
          id: string
          period_end: string
          period_start: string
          total_volume: number | null
        }
        Insert: {
          activities_completed?: number | null
          agent_id: string
          contacts_added?: number | null
          created_at?: string | null
          deals_closed?: number | null
          division: string
          id?: string
          period_end: string
          period_start: string
          total_volume?: number | null
        }
        Update: {
          activities_completed?: number | null
          agent_id?: string
          contacts_added?: number | null
          created_at?: string | null
          deals_closed?: number | null
          division?: string
          id?: string
          period_end?: string
          period_start?: string
          total_volume?: number | null
        }
        Relationships: []
      }
      agent_notes: {
        Row: {
          agent_id: string
          ai_summary: string | null
          category: string | null
          color: string | null
          contact_id: string | null
          content: string | null
          created_at: string | null
          deal_id: string | null
          folder_id: string | null
          id: string
          is_pinned: boolean | null
          priority: string | null
          starred: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          ai_summary?: string | null
          category?: string | null
          color?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          deal_id?: string | null
          folder_id?: string | null
          id?: string
          is_pinned?: boolean | null
          priority?: string | null
          starred?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          ai_summary?: string | null
          category?: string | null
          color?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          deal_id?: string | null
          folder_id?: string | null
          id?: string
          is_pinned?: boolean | null
          priority?: string | null
          starred?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_notes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_notes_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "note_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_requests: {
        Row: {
          agent_id: string
          client_name: string | null
          created_at: string
          id: string
          notes: string | null
          priority: string
          property_address: string | null
          request_type: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          client_name?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string
          property_address?: string | null
          request_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          client_name?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string
          property_address?: string | null
          request_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_templates: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          division: string
          file_type: string | null
          file_url: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          division: string
          file_type?: string | null
          file_url: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          division?: string
          file_type?: string | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
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
      cache_entries: {
        Row: {
          created_at: string | null
          expires_at: string
          hit_count: number | null
          key: string
          metadata: Json | null
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          hit_count?: number | null
          key: string
          metadata?: Json | null
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          hit_count?: number | null
          key?: string
          metadata?: Json | null
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string | null
          event_type: string | null
          id: string
          is_active: boolean | null
          location: string | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          all_day?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          all_day?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_intake_links: {
        Row: {
          agent_id: string
          created_at: string | null
          division: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          link_code: string
          name: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          division?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          link_code: string
          name: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          division?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          link_code?: string
          name?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      client_intake_submissions: {
        Row: {
          agent_id: string
          client_company: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          contacted_at: string | null
          converted_contact_id: string | null
          converted_deal_id: string | null
          created_at: string | null
          criteria: Json
          division: string
          id: string
          is_general_inquiry: boolean | null
          link_id: string | null
          notes: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          client_company?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          contacted_at?: string | null
          converted_contact_id?: string | null
          converted_deal_id?: string | null
          created_at?: string | null
          criteria?: Json
          division: string
          id?: string
          is_general_inquiry?: boolean | null
          link_id?: string | null
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          client_company?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          contacted_at?: string | null
          converted_contact_id?: string | null
          converted_deal_id?: string | null
          created_at?: string | null
          criteria?: Json
          division?: string
          id?: string
          is_general_inquiry?: boolean | null
          link_id?: string | null
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_intake_submissions_converted_contact_id_fkey"
            columns: ["converted_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_intake_submissions_converted_deal_id_fkey"
            columns: ["converted_deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_intake_submissions_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "client_intake_links"
            referencedColumns: ["id"]
          },
        ]
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
      commercial_listing_documents: {
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
            foreignKeyName: "commercial_listing_documents_listing_id_fkey"
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
      commission_requests: {
        Row: {
          admin_notes: string | null
          agent_id: string
          closing_date: string
          commission_amount: number
          contract_url: string | null
          created_at: string
          deal_type: string
          id: string
          invoice_url: string | null
          notes: string | null
          paid_at: string | null
          property_address: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          w9_url: string | null
        }
        Insert: {
          admin_notes?: string | null
          agent_id: string
          closing_date: string
          commission_amount: number
          contract_url?: string | null
          created_at?: string
          deal_type: string
          id?: string
          invoice_url?: string | null
          notes?: string | null
          paid_at?: string | null
          property_address: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          w9_url?: string | null
        }
        Update: {
          admin_notes?: string | null
          agent_id?: string
          closing_date?: string
          commission_amount?: number
          contract_url?: string | null
          created_at?: string
          deal_type?: string
          id?: string
          invoice_url?: string | null
          notes?: string | null
          paid_at?: string | null
          property_address?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          w9_url?: string | null
        }
        Relationships: []
      }
      company_announcements: {
        Row: {
          announcement_type: string
          content: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_pinned: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          announcement_type?: string
          content: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_pinned?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          announcement_type?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_pinned?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_sync_log: {
        Row: {
          agent_id: string
          created_at: string | null
          crm_contact_id: string | null
          google_contact_id: string
          google_etag: string | null
          id: string
          last_synced_at: string | null
          sync_direction: string | null
          sync_status: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          crm_contact_id?: string | null
          google_contact_id: string
          google_etag?: string | null
          id?: string
          last_synced_at?: string | null
          sync_direction?: string | null
          sync_status?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          crm_contact_id?: string | null
          google_contact_id?: string
          google_etag?: string | null
          id?: string
          last_synced_at?: string | null
          sync_direction?: string | null
          sync_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_sync_log_crm_contact_id_fkey"
            columns: ["crm_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          activity_type: string
          agent_id: string
          category: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          description: string | null
          division: string | null
          due_date: string | null
          id: string
          is_all_day: boolean | null
          is_completed: boolean | null
          priority: string | null
          recurring_pattern: string | null
          reminder_at: string | null
          title: string
        }
        Insert: {
          activity_type: string
          agent_id: string
          category?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          division?: string | null
          due_date?: string | null
          id?: string
          is_all_day?: boolean | null
          is_completed?: boolean | null
          priority?: string | null
          recurring_pattern?: string | null
          reminder_at?: string | null
          title: string
        }
        Update: {
          activity_type?: string
          agent_id?: string
          category?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          division?: string | null
          due_date?: string | null
          id?: string
          is_all_day?: boolean | null
          is_completed?: boolean | null
          priority?: string | null
          recurring_pattern?: string | null
          reminder_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          address: string | null
          agent_id: string
          assistant_email: string | null
          assistant_name: string | null
          assistant_phone: string | null
          birthday: string | null
          city: string | null
          company: string | null
          company_website: string | null
          contact_type: string
          country: string | null
          created_at: string | null
          division: string
          do_not_contact: boolean | null
          email: string | null
          full_name: string
          id: string
          investment_criteria: Json | null
          investor_profile: string | null
          is_active: boolean | null
          last_contact_date: string | null
          latitude: number | null
          linkedin_url: string | null
          longitude: number | null
          notes: string | null
          ownership_entities: string[] | null
          phone: string | null
          portfolio_size: number | null
          preferred_asset_types: string[] | null
          preferred_contact_method: string | null
          relationship_score: number | null
          secondary_email: string | null
          secondary_phone: string | null
          source: string | null
          state: string | null
          street_address: string | null
          tags: string[] | null
          target_markets: string[] | null
          title: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          agent_id: string
          assistant_email?: string | null
          assistant_name?: string | null
          assistant_phone?: string | null
          birthday?: string | null
          city?: string | null
          company?: string | null
          company_website?: string | null
          contact_type?: string
          country?: string | null
          created_at?: string | null
          division: string
          do_not_contact?: boolean | null
          email?: string | null
          full_name: string
          id?: string
          investment_criteria?: Json | null
          investor_profile?: string | null
          is_active?: boolean | null
          last_contact_date?: string | null
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          notes?: string | null
          ownership_entities?: string[] | null
          phone?: string | null
          portfolio_size?: number | null
          preferred_asset_types?: string[] | null
          preferred_contact_method?: string | null
          relationship_score?: number | null
          secondary_email?: string | null
          secondary_phone?: string | null
          source?: string | null
          state?: string | null
          street_address?: string | null
          tags?: string[] | null
          target_markets?: string[] | null
          title?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          agent_id?: string
          assistant_email?: string | null
          assistant_name?: string | null
          assistant_phone?: string | null
          birthday?: string | null
          city?: string | null
          company?: string | null
          company_website?: string | null
          contact_type?: string
          country?: string | null
          created_at?: string | null
          division?: string
          do_not_contact?: boolean | null
          email?: string | null
          full_name?: string
          id?: string
          investment_criteria?: Json | null
          investor_profile?: string | null
          is_active?: boolean | null
          last_contact_date?: string | null
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          notes?: string | null
          ownership_entities?: string[] | null
          phone?: string | null
          portfolio_size?: number | null
          preferred_asset_types?: string[] | null
          preferred_contact_method?: string | null
          relationship_score?: number | null
          secondary_email?: string | null
          secondary_phone?: string | null
          source?: string | null
          state?: string | null
          street_address?: string | null
          tags?: string[] | null
          target_markets?: string[] | null
          title?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      crm_deal_stages: {
        Row: {
          color: string
          created_at: string | null
          display_order: number
          division: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string
          created_at?: string | null
          display_order?: number
          division: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          display_order?: number
          division?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      crm_deals: {
        Row: {
          agent_id: string
          asking_price: number | null
          asking_rent_psf: number | null
          bathrooms: number | null
          bedrooms: number | null
          borough: string | null
          building_class: string | null
          cap_rate: number | null
          co_broke_percent: number | null
          co_broker_id: string | null
          co_broker_name: string | null
          co_broker_split: number | null
          commencement_date: string | null
          commission: number | null
          contact_id: string | null
          created_at: string | null
          deal_category: string | null
          deal_type: string
          division: string
          due_date: string | null
          due_diligence_deadline: string | null
          escalation_rate: number | null
          expected_close: string | null
          expiration_date: string | null
          financing_type: string | null
          free_rent_months: number | null
          gross_sf: number | null
          guarantor_required: boolean | null
          id: string
          ideal_close_date: string | null
          is_1031_exchange: boolean | null
          is_active: boolean | null
          is_lost: boolean | null
          is_rental: boolean | null
          landlord_broker: string | null
          last_activity_date: string | null
          latitude: number | null
          lease_length_months: number | null
          lease_term_months: number | null
          lease_type: string | null
          lender_name: string | null
          listing_price: number | null
          loan_amount: number | null
          longitude: number | null
          lost_reason: string | null
          lot_size: number | null
          monthly_rent: number | null
          move_in_date: string | null
          move_in_urgency: string | null
          negotiated_rent_psf: number | null
          neighborhood: string | null
          noi: number | null
          notes: string | null
          offer_price: number | null
          pets_allowed: boolean | null
          price_per_sf: number | null
          price_per_unit: number | null
          priority: string | null
          probability: number | null
          property_address: string
          property_condition: string | null
          property_type: string | null
          referral_source: string | null
          security_deposit_months: number | null
          space_type: string | null
          stage_id: string | null
          tenant_business_type: string | null
          tenant_legal_name: string | null
          ti_allowance_psf: number | null
          unit_count: number | null
          updated_at: string | null
          use_clause: string | null
          value: number | null
          won: boolean | null
          year_built: number | null
          zoning: string | null
        }
        Insert: {
          agent_id: string
          asking_price?: number | null
          asking_rent_psf?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          building_class?: string | null
          cap_rate?: number | null
          co_broke_percent?: number | null
          co_broker_id?: string | null
          co_broker_name?: string | null
          co_broker_split?: number | null
          commencement_date?: string | null
          commission?: number | null
          contact_id?: string | null
          created_at?: string | null
          deal_category?: string | null
          deal_type: string
          division: string
          due_date?: string | null
          due_diligence_deadline?: string | null
          escalation_rate?: number | null
          expected_close?: string | null
          expiration_date?: string | null
          financing_type?: string | null
          free_rent_months?: number | null
          gross_sf?: number | null
          guarantor_required?: boolean | null
          id?: string
          ideal_close_date?: string | null
          is_1031_exchange?: boolean | null
          is_active?: boolean | null
          is_lost?: boolean | null
          is_rental?: boolean | null
          landlord_broker?: string | null
          last_activity_date?: string | null
          latitude?: number | null
          lease_length_months?: number | null
          lease_term_months?: number | null
          lease_type?: string | null
          lender_name?: string | null
          listing_price?: number | null
          loan_amount?: number | null
          longitude?: number | null
          lost_reason?: string | null
          lot_size?: number | null
          monthly_rent?: number | null
          move_in_date?: string | null
          move_in_urgency?: string | null
          negotiated_rent_psf?: number | null
          neighborhood?: string | null
          noi?: number | null
          notes?: string | null
          offer_price?: number | null
          pets_allowed?: boolean | null
          price_per_sf?: number | null
          price_per_unit?: number | null
          priority?: string | null
          probability?: number | null
          property_address: string
          property_condition?: string | null
          property_type?: string | null
          referral_source?: string | null
          security_deposit_months?: number | null
          space_type?: string | null
          stage_id?: string | null
          tenant_business_type?: string | null
          tenant_legal_name?: string | null
          ti_allowance_psf?: number | null
          unit_count?: number | null
          updated_at?: string | null
          use_clause?: string | null
          value?: number | null
          won?: boolean | null
          year_built?: number | null
          zoning?: string | null
        }
        Update: {
          agent_id?: string
          asking_price?: number | null
          asking_rent_psf?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          borough?: string | null
          building_class?: string | null
          cap_rate?: number | null
          co_broke_percent?: number | null
          co_broker_id?: string | null
          co_broker_name?: string | null
          co_broker_split?: number | null
          commencement_date?: string | null
          commission?: number | null
          contact_id?: string | null
          created_at?: string | null
          deal_category?: string | null
          deal_type?: string
          division?: string
          due_date?: string | null
          due_diligence_deadline?: string | null
          escalation_rate?: number | null
          expected_close?: string | null
          expiration_date?: string | null
          financing_type?: string | null
          free_rent_months?: number | null
          gross_sf?: number | null
          guarantor_required?: boolean | null
          id?: string
          ideal_close_date?: string | null
          is_1031_exchange?: boolean | null
          is_active?: boolean | null
          is_lost?: boolean | null
          is_rental?: boolean | null
          landlord_broker?: string | null
          last_activity_date?: string | null
          latitude?: number | null
          lease_length_months?: number | null
          lease_term_months?: number | null
          lease_type?: string | null
          lender_name?: string | null
          listing_price?: number | null
          loan_amount?: number | null
          longitude?: number | null
          lost_reason?: string | null
          lot_size?: number | null
          monthly_rent?: number | null
          move_in_date?: string | null
          move_in_urgency?: string | null
          negotiated_rent_psf?: number | null
          neighborhood?: string | null
          noi?: number | null
          notes?: string | null
          offer_price?: number | null
          pets_allowed?: boolean | null
          price_per_sf?: number | null
          price_per_unit?: number | null
          priority?: string | null
          probability?: number | null
          property_address?: string
          property_condition?: string | null
          property_type?: string | null
          referral_source?: string | null
          security_deposit_months?: number | null
          space_type?: string | null
          stage_id?: string | null
          tenant_business_type?: string | null
          tenant_legal_name?: string | null
          ti_allowance_psf?: number | null
          unit_count?: number | null
          updated_at?: string | null
          use_clause?: string | null
          value?: number | null
          won?: boolean | null
          year_built?: number | null
          zoning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_deal_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_referrals: {
        Row: {
          accepted_at: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          from_division: string
          id: string
          notes: string | null
          receiving_agent_id: string | null
          referral_fee_amount: number | null
          referral_fee_percent: number | null
          referring_agent_id: string
          status: string | null
          to_division: string
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          from_division: string
          id?: string
          notes?: string | null
          receiving_agent_id?: string | null
          referral_fee_amount?: number | null
          referral_fee_percent?: number | null
          referring_agent_id: string
          status?: string | null
          to_division: string
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          from_division?: string
          id?: string
          notes?: string | null
          receiving_agent_id?: string | null
          referral_fee_amount?: number | null
          referral_fee_percent?: number | null
          referring_agent_id?: string
          status?: string | null
          to_division?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_referrals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_referrals_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_saved_filters: {
        Row: {
          agent_id: string
          created_at: string | null
          division: string
          filter_config: Json
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          division: string
          filter_config?: Json
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          division?: string
          filter_config?: Json
          id?: string
          is_default?: boolean | null
          name?: string
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
          {
            foreignKeyName: "deal_room_documents_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "public_investment_listings"
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
      drive_documents: {
        Row: {
          agent_id: string
          category: string | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          drive_file_id: string
          id: string
          mime_type: string | null
          name: string
          property_address: string | null
          size_bytes: number | null
          thumbnail_url: string | null
          updated_at: string | null
          web_content_link: string | null
          web_view_link: string | null
        }
        Insert: {
          agent_id: string
          category?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          drive_file_id: string
          id?: string
          mime_type?: string | null
          name: string
          property_address?: string | null
          size_bytes?: number | null
          thumbnail_url?: string | null
          updated_at?: string | null
          web_content_link?: string | null
          web_view_link?: string | null
        }
        Update: {
          agent_id?: string
          category?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          drive_file_id?: string
          id?: string
          mime_type?: string | null
          name?: string
          property_address?: string | null
          size_bytes?: number | null
          thumbnail_url?: string | null
          updated_at?: string | null
          web_content_link?: string | null
          web_view_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_documents_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      email_attachments: {
        Row: {
          attached_at: string | null
          attached_by: string
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          email_thread_id: string | null
          id: string
        }
        Insert: {
          attached_at?: string | null
          attached_by: string
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          email_thread_id?: string | null
          id?: string
        }
        Update: {
          attached_at?: string | null
          attached_by?: string
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          email_thread_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_attachments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_attachments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_attachments_email_thread_id_fkey"
            columns: ["email_thread_id"]
            isOneToOne: false
            referencedRelation: "email_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      email_contact_links: {
        Row: {
          agent_id: string
          contact_id: string
          created_at: string
          email_from: string | null
          email_id: string
          email_subject: string | null
          id: string
          linked_at: string
          thread_id: string
        }
        Insert: {
          agent_id: string
          contact_id: string
          created_at?: string
          email_from?: string | null
          email_id: string
          email_subject?: string | null
          id?: string
          linked_at?: string
          thread_id: string
        }
        Update: {
          agent_id?: string
          contact_id?: string
          created_at?: string
          email_from?: string | null
          email_id?: string
          email_subject?: string | null
          id?: string
          linked_at?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_contact_links_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_deal_links: {
        Row: {
          agent_id: string
          created_at: string
          deal_id: string
          email_from: string | null
          email_id: string
          email_subject: string | null
          id: string
          linked_at: string
          thread_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          deal_id: string
          email_from?: string | null
          email_id: string
          email_subject?: string | null
          id?: string
          linked_at?: string
          thread_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          deal_id?: string
          email_from?: string | null
          email_id?: string
          email_subject?: string | null
          id?: string
          linked_at?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_deal_links_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      email_threads: {
        Row: {
          agent_id: string
          body_html: string | null
          body_text: string | null
          cc_addresses: string[] | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          from_address: string | null
          from_name: string | null
          gmail_message_id: string | null
          gmail_thread_id: string
          has_attachments: boolean | null
          id: string
          is_read: boolean | null
          is_starred: boolean | null
          labels: string[] | null
          received_at: string | null
          snippet: string | null
          subject: string | null
          to_addresses: string[] | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          body_html?: string | null
          body_text?: string | null
          cc_addresses?: string[] | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          from_address?: string | null
          from_name?: string | null
          gmail_message_id?: string | null
          gmail_thread_id: string
          has_attachments?: boolean | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          labels?: string[] | null
          received_at?: string | null
          snippet?: string | null
          subject?: string | null
          to_addresses?: string[] | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          body_html?: string | null
          body_text?: string | null
          cc_addresses?: string[] | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          from_address?: string | null
          from_name?: string | null
          gmail_message_id?: string | null
          gmail_thread_id?: string
          has_attachments?: boolean | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          labels?: string[] | null
          received_at?: string | null
          snippet?: string | null
          subject?: string | null
          to_addresses?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_threads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_threads_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      exclusive_submissions: {
        Row: {
          additional_documents: Json | null
          admin_notes: string | null
          agent_id: string
          borough: string | null
          city: string | null
          converted_deal_id: string | null
          created_at: string
          division: string
          exclusive_contract_url: string | null
          google_calendar_event_id: string | null
          id: string
          is_off_market: boolean | null
          is_pocket_listing: boolean | null
          latitude: number | null
          listing_data: Json
          longitude: number | null
          neighborhood: string | null
          owner_company: string | null
          owner_email: string | null
          owner_name: string
          owner_phone: string | null
          property_address: string
          reviewed_at: string | null
          reviewed_by: string | null
          state: string | null
          status: string
          unit_number: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          additional_documents?: Json | null
          admin_notes?: string | null
          agent_id: string
          borough?: string | null
          city?: string | null
          converted_deal_id?: string | null
          created_at?: string
          division: string
          exclusive_contract_url?: string | null
          google_calendar_event_id?: string | null
          id?: string
          is_off_market?: boolean | null
          is_pocket_listing?: boolean | null
          latitude?: number | null
          listing_data?: Json
          longitude?: number | null
          neighborhood?: string | null
          owner_company?: string | null
          owner_email?: string | null
          owner_name: string
          owner_phone?: string | null
          property_address: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          state?: string | null
          status?: string
          unit_number?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          additional_documents?: Json | null
          admin_notes?: string | null
          agent_id?: string
          borough?: string | null
          city?: string | null
          converted_deal_id?: string | null
          created_at?: string
          division?: string
          exclusive_contract_url?: string | null
          google_calendar_event_id?: string | null
          id?: string
          is_off_market?: boolean | null
          is_pocket_listing?: boolean | null
          latitude?: number | null
          listing_data?: Json
          longitude?: number | null
          neighborhood?: string | null
          owner_company?: string | null
          owner_email?: string | null
          owner_name?: string
          owner_phone?: string | null
          property_address?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          state?: string | null
          status?: string
          unit_number?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exclusive_submissions_converted_deal_id_fkey"
            columns: ["converted_deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      external_tools: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          name: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon: string
          id?: string
          is_active?: boolean | null
          name: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          url?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          assignment_type: string | null
          budget: string | null
          contacted_at: string | null
          contacted_by: string | null
          created_at: string
          email: string
          follow_up_notes: string | null
          id: string
          inquiry_type: string | null
          name: string
          neighborhoods: string | null
          notes: string | null
          phone: string | null
          property_address: string | null
          requirements: string | null
          status: string | null
          timeline: string | null
          timing: string | null
          unit_count: string | null
          user_type: string | null
        }
        Insert: {
          assignment_type?: string | null
          budget?: string | null
          contacted_at?: string | null
          contacted_by?: string | null
          created_at?: string
          email: string
          follow_up_notes?: string | null
          id?: string
          inquiry_type?: string | null
          name: string
          neighborhoods?: string | null
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          requirements?: string | null
          status?: string | null
          timeline?: string | null
          timing?: string | null
          unit_count?: string | null
          user_type?: string | null
        }
        Update: {
          assignment_type?: string | null
          budget?: string | null
          contacted_at?: string | null
          contacted_by?: string | null
          created_at?: string
          email?: string
          follow_up_notes?: string | null
          id?: string
          inquiry_type?: string | null
          name?: string
          neighborhoods?: string | null
          notes?: string | null
          phone?: string | null
          property_address?: string | null
          requirements?: string | null
          status?: string | null
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
          {
            foreignKeyName: "investment_listing_agents_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "public_investment_listings"
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
      note_folders: {
        Row: {
          agent_id: string
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          parent_folder_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_folder_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_folder_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "note_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      note_participants: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          note_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          note_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          note_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_participants_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_participants_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "agent_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          agent_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          title: string
          type: string
        }
        Insert: {
          action_url?: string | null
          agent_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title: string
          type: string
        }
        Update: {
          action_url?: string | null
          agent_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          onboarding_checklist: Json | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          phone: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          onboarding_checklist?: Json | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_checklist?: Json | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      snoozed_emails: {
        Row: {
          agent_id: string
          created_at: string
          email_from: string | null
          email_id: string
          email_subject: string | null
          id: string
          snooze_until: string
          snoozed_at: string
          thread_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          email_from?: string | null
          email_id: string
          email_subject?: string | null
          id?: string
          snooze_until: string
          snoozed_at?: string
          thread_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          email_from?: string | null
          email_id?: string
          email_subject?: string | null
          id?: string
          snooze_until?: string
          snoozed_at?: string
          thread_id?: string
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
          commission: number | null
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
          commission?: number | null
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
          commission?: number | null
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
      user_google_tokens: {
        Row: {
          access_token: string | null
          calendar_enabled: boolean | null
          contacts_access_token: string | null
          contacts_enabled: boolean | null
          contacts_refresh_token: string | null
          created_at: string | null
          drive_access_token: string | null
          drive_enabled: boolean | null
          drive_refresh_token: string | null
          gmail_access_token: string | null
          gmail_enabled: boolean | null
          gmail_refresh_token: string | null
          google_avatar_url: string | null
          google_email: string | null
          google_name: string | null
          refresh_token: string | null
          token_expiry: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_enabled?: boolean | null
          contacts_access_token?: string | null
          contacts_enabled?: boolean | null
          contacts_refresh_token?: string | null
          created_at?: string | null
          drive_access_token?: string | null
          drive_enabled?: boolean | null
          drive_refresh_token?: string | null
          gmail_access_token?: string | null
          gmail_enabled?: boolean | null
          gmail_refresh_token?: string | null
          google_avatar_url?: string | null
          google_email?: string | null
          google_name?: string | null
          refresh_token?: string | null
          token_expiry?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_enabled?: boolean | null
          contacts_access_token?: string | null
          contacts_enabled?: boolean | null
          contacts_refresh_token?: string | null
          created_at?: string | null
          drive_access_token?: string | null
          drive_enabled?: boolean | null
          drive_refresh_token?: string | null
          gmail_access_token?: string | null
          gmail_enabled?: boolean | null
          gmail_refresh_token?: string | null
          google_avatar_url?: string | null
          google_email?: string | null
          google_name?: string | null
          refresh_token?: string | null
          token_expiry?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_division: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_division?: string | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_division?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      agent_performance_stats: {
        Row: {
          agent_name: string | null
          avg_deal_size: number | null
          deal_count: number | null
          divisions: string[] | null
          total_commission: number | null
          total_volume: number | null
        }
        Relationships: []
      }
      division_breakdown_stats: {
        Row: {
          division_name: string | null
          total_commission: number | null
          total_volume: number | null
          transaction_count: number | null
        }
        Relationships: []
      }
      investor_dashboard_stats: {
        Row: {
          active_agents: number | null
          active_listings: number | null
          avg_deal_size: number | null
          prev_year_transactions: number | null
          prev_year_volume: number | null
          total_commissions: number | null
          total_transactions: number | null
          total_volume: number | null
          ytd_transactions: number | null
          ytd_volume: number | null
        }
        Relationships: []
      }
      pending_counts_stats: {
        Row: {
          high_priority_requests: number | null
          pending_agent_requests: number | null
          pending_commission_requests: number | null
        }
        Relationships: []
      }
      public_investment_listings: {
        Row: {
          asking_price: number | null
          asset_class: string | null
          borough: string | null
          cap_rate: number | null
          created_at: string | null
          description: string | null
          display_order: number | null
          gross_sf: number | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          listing_agent_id: string | null
          neighborhood: string | null
          om_url: string | null
          property_address: string | null
          units: number | null
          updated_at: string | null
          year_built: number | null
        }
        Insert: {
          asking_price?: number | null
          asset_class?: string | null
          borough?: string | null
          cap_rate?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          gross_sf?: number | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          listing_agent_id?: string | null
          neighborhood?: string | null
          om_url?: string | null
          property_address?: string | null
          units?: number | null
          updated_at?: string | null
          year_built?: number | null
        }
        Update: {
          asking_price?: number | null
          asset_class?: string | null
          borough?: string | null
          cap_rate?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          gross_sf?: number | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          listing_agent_id?: string | null
          neighborhood?: string | null
          om_url?: string | null
          property_address?: string | null
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
      team_members_public: {
        Row: {
          bio: string | null
          category: string | null
          display_order: number | null
          email: string | null
          id: string | null
          image_url: string | null
          instagram_url: string | null
          is_active: boolean | null
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
          is_active?: boolean | null
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
          is_active?: boolean | null
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
      cleanup_expired_cache: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      get_agent_transactions: {
        Args: { p_agent_email: string; p_agent_full_name: string }
        Returns: {
          agent_name: string
          asset_type: string | null
          borough: string | null
          building_id: string | null
          closing_date: string | null
          commission: number | null
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
        }[]
        SetofOptions: {
          from: "*"
          to: "transactions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_division: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_agent: { Args: { _user_id: string }; Returns: boolean }
      is_admin_user: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "agent" | "user" | "investor"
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
      app_role: ["admin", "agent", "user", "investor"],
    },
  },
} as const
