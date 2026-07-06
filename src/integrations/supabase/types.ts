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
          actor_user_id: string | null
          client_id: string | null
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          client_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          client_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
        ]
      }
      ai_briefs: {
        Row: {
          ai_output: Json
          ai_output_type: string
          ai_status: string
          client_id: string
          client_submission_id: string | null
          created_at: string
          id: string
          impact_score: number | null
          input_context: Json
          is_latest: boolean
          model_meta: Json
          regeneration_count: number
          review_notes: Json
          status: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_output?: Json
          ai_output_type?: string
          ai_status?: string
          client_id: string
          client_submission_id?: string | null
          created_at?: string
          id?: string
          impact_score?: number | null
          input_context?: Json
          is_latest?: boolean
          model_meta?: Json
          regeneration_count?: number
          review_notes?: Json
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_output?: Json
          ai_output_type?: string
          ai_status?: string
          client_id?: string
          client_submission_id?: string | null
          created_at?: string
          id?: string
          impact_score?: number | null
          input_context?: Json
          is_latest?: boolean
          model_meta?: Json
          regeneration_count?: number
          review_notes?: Json
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_briefs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_briefs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "ai_briefs_client_submission_id_fkey"
            columns: ["client_submission_id"]
            isOneToOne: false
            referencedRelation: "client_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_runs: {
        Row: {
          automation_id: string
          client_id: string | null
          client_submission_id: string | null
          created_at: string
          error_message: string | null
          finished_at: string | null
          id: string
          input_context: Json
          output_context: Json
          run_key: string
          run_status: string
          started_at: string | null
          trigger_event: string
          updated_at: string
        }
        Insert: {
          automation_id: string
          client_id?: string | null
          client_submission_id?: string | null
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_context?: Json
          output_context?: Json
          run_key: string
          run_status?: string
          started_at?: string | null
          trigger_event: string
          updated_at?: string
        }
        Update: {
          automation_id?: string
          client_id?: string | null
          client_submission_id?: string | null
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_context?: Json
          output_context?: Json
          run_key?: string
          run_status?: string
          started_at?: string | null
          trigger_event?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_runs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_runs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "automation_runs_client_submission_id_fkey"
            columns: ["client_submission_id"]
            isOneToOne: false
            referencedRelation: "client_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          trigger_event: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          trigger_event: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          trigger_event?: string
          updated_at?: string
        }
        Relationships: []
      }
      brand_manager_profiles: {
        Row: {
          audience: Json
          brand_maturity_score: number
          brand_mission: string | null
          brand_name: string | null
          brand_personality: Json
          brand_story: string | null
          brand_vision: string | null
          category: string | null
          client_id: string
          communication_style: Json
          created_at: string
          digital_assets: Json
          growth_opportunities: Json
          id: string
          industry: string | null
          missing_assets: Json
          physical_assets: Json
          positioning_statement: string | null
          primary_colors: Json
          profile_status: string
          published_snapshot: Json | null
          recommendations: Json
          secondary_colors: Json
          social_platforms: Json
          strategist_notes: string | null
          synthesis_meta: Json
          typography: Json
          updated_at: string
          visual_identity: Json
          website_url: string | null
        }
        Insert: {
          audience?: Json
          brand_maturity_score?: number
          brand_mission?: string | null
          brand_name?: string | null
          brand_personality?: Json
          brand_story?: string | null
          brand_vision?: string | null
          category?: string | null
          client_id: string
          communication_style?: Json
          created_at?: string
          digital_assets?: Json
          growth_opportunities?: Json
          id?: string
          industry?: string | null
          missing_assets?: Json
          physical_assets?: Json
          positioning_statement?: string | null
          primary_colors?: Json
          profile_status?: string
          published_snapshot?: Json | null
          recommendations?: Json
          secondary_colors?: Json
          social_platforms?: Json
          strategist_notes?: string | null
          synthesis_meta?: Json
          typography?: Json
          updated_at?: string
          visual_identity?: Json
          website_url?: string | null
        }
        Update: {
          audience?: Json
          brand_maturity_score?: number
          brand_mission?: string | null
          brand_name?: string | null
          brand_personality?: Json
          brand_story?: string | null
          brand_vision?: string | null
          category?: string | null
          client_id?: string
          communication_style?: Json
          created_at?: string
          digital_assets?: Json
          growth_opportunities?: Json
          id?: string
          industry?: string | null
          missing_assets?: Json
          physical_assets?: Json
          positioning_statement?: string | null
          primary_colors?: Json
          profile_status?: string
          published_snapshot?: Json | null
          recommendations?: Json
          secondary_colors?: Json
          social_platforms?: Json
          strategist_notes?: string | null
          synthesis_meta?: Json
          typography?: Json
          updated_at?: string
          visual_identity?: Json
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_manager_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_documents: {
        Row: {
          brand_profile_id: string
          created_at: string
          id: string
          sections: Json
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          brand_profile_id: string
          created_at?: string
          id?: string
          sections?: Json
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          brand_profile_id?: string
          created_at?: string
          id?: string
          sections?: Json
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_documents_brand_profile_id_fkey"
            columns: ["brand_profile_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_profiles: {
        Row: {
          audience: Json
          created_at: string
          id: string
          is_current: boolean
          raw_response: string | null
          status: string
          strategy: Json
          submission_id: string
          updated_at: string
          version: number
          voice: Json
        }
        Insert: {
          audience?: Json
          created_at?: string
          id?: string
          is_current?: boolean
          raw_response?: string | null
          status?: string
          strategy?: Json
          submission_id: string
          updated_at?: string
          version?: number
          voice?: Json
        }
        Update: {
          audience?: Json
          created_at?: string
          id?: string
          is_current?: boolean
          raw_response?: string | null
          status?: string
          strategy?: Json
          submission_id?: string
          updated_at?: string
          version?: number
          voice?: Json
        }
        Relationships: [
          {
            foreignKeyName: "brand_profiles_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "cms_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_drafts: {
        Row: {
          ai_output_type: string
          ai_status: string
          campaign_id: string
          channel: string
          client_id: string
          created_at: string
          draft_payload: Json
          draft_text: string | null
          generation_context: Json
          id: string
          impact_score: number | null
          model_meta: Json
          status: string
          title: string | null
          updated_at: string
          version: number
        }
        Insert: {
          ai_output_type?: string
          ai_status?: string
          campaign_id: string
          channel: string
          client_id: string
          created_at?: string
          draft_payload?: Json
          draft_text?: string | null
          generation_context?: Json
          id?: string
          impact_score?: number | null
          model_meta?: Json
          status?: string
          title?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          ai_output_type?: string
          ai_status?: string
          campaign_id?: string
          channel?: string
          client_id?: string
          created_at?: string
          draft_payload?: Json
          draft_text?: string | null
          generation_context?: Json
          id?: string
          impact_score?: number | null
          model_meta?: Json
          status?: string
          title?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaign_drafts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_drafts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_drafts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ai_brief_id: string | null
          channels: Json
          client_id: string
          created_at: string
          end_date: string | null
          id: string
          metadata: Json
          name: string
          objective: string | null
          start_date: string | null
          status: string
          target_segment: Json
          updated_at: string
        }
        Insert: {
          ai_brief_id?: string | null
          channels?: Json
          client_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          metadata?: Json
          name: string
          objective?: string | null
          start_date?: string | null
          status?: string
          target_segment?: Json
          updated_at?: string
        }
        Update: {
          ai_brief_id?: string | null
          channels?: Json
          client_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          metadata?: Json
          name?: string
          objective?: string | null
          start_date?: string | null
          status?: string
          target_segment?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_ai_brief_id_fkey"
            columns: ["ai_brief_id"]
            isOneToOne: false
            referencedRelation: "ai_briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_scores: {
        Row: {
          calculated_at: string
          client_id: string
          created_at: string
          factors: Json
          id: string
          recommendations: Json
          score_band: string
          score_type: string
          score_value: number
          status: string
          updated_at: string
        }
        Insert: {
          calculated_at?: string
          client_id: string
          created_at?: string
          factors?: Json
          id?: string
          recommendations?: Json
          score_band: string
          score_type: string
          score_value: number
          status?: string
          updated_at?: string
        }
        Update: {
          calculated_at?: string
          client_id?: string
          created_at?: string
          factors?: Json
          id?: string
          recommendations?: Json
          score_band?: string
          score_type?: string
          score_value?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_scores_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_scores_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_segments: {
        Row: {
          client_id: string
          client_submission_id: string | null
          confidence: number
          created_at: string
          id: string
          rationale: Json
          segment_key: string
          segment_name: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_submission_id?: string | null
          confidence?: number
          created_at?: string
          id?: string
          rationale?: Json
          segment_key: string
          segment_name: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_submission_id?: string | null
          confidence?: number
          created_at?: string
          id?: string
          rationale?: Json
          segment_key?: string
          segment_name?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_segments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_segments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_segments_client_submission_id_fkey"
            columns: ["client_submission_id"]
            isOneToOne: false
            referencedRelation: "client_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      client_submissions: {
        Row: {
          ai_classification: Json
          approval_blocked: boolean
          client_id: string
          cms_submission_id: string | null
          created_at: string
          id: string
          onboarding_status: string
          paid_client_at: string | null
          profile_data: Json
          qualified_lead_at: string | null
          service_type: string
          status: string
          submission_source: string
          submitted_at: string
          turnaround_completed_at: string | null
          updated_at: string
        }
        Insert: {
          ai_classification?: Json
          approval_blocked?: boolean
          client_id: string
          cms_submission_id?: string | null
          created_at?: string
          id?: string
          onboarding_status?: string
          paid_client_at?: string | null
          profile_data?: Json
          qualified_lead_at?: string | null
          service_type?: string
          status?: string
          submission_source?: string
          submitted_at?: string
          turnaround_completed_at?: string | null
          updated_at?: string
        }
        Update: {
          ai_classification?: Json
          approval_blocked?: boolean
          client_id?: string
          cms_submission_id?: string | null
          created_at?: string
          id?: string
          onboarding_status?: string
          paid_client_at?: string | null
          profile_data?: Json
          qualified_lead_at?: string | null
          service_type?: string
          status?: string
          submission_source?: string
          submitted_at?: string
          turnaround_completed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_submissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_submissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_submissions_cms_submission_id_fkey"
            columns: ["cms_submission_id"]
            isOneToOne: false
            referencedRelation: "cms_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_name: string
          created_at: string
          has_used_vespa: boolean
          health_scores: Json
          id: string
          industry: string | null
          lifecycle_stage: string
          metadata: Json
          notes: string | null
          onboarding_progress: Json
          pipeline_value: number
          primary_contact_email: string
          primary_contact_name: string | null
          primary_service_type: string | null
          revenue_stage: string
          source: string
          status: string
          updated_at: string
          vespa_last_activity_at: string | null
          website: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          has_used_vespa?: boolean
          health_scores?: Json
          id?: string
          industry?: string | null
          lifecycle_stage?: string
          metadata?: Json
          notes?: string | null
          onboarding_progress?: Json
          pipeline_value?: number
          primary_contact_email: string
          primary_contact_name?: string | null
          primary_service_type?: string | null
          revenue_stage?: string
          source?: string
          status?: string
          updated_at?: string
          vespa_last_activity_at?: string | null
          website?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          has_used_vespa?: boolean
          health_scores?: Json
          id?: string
          industry?: string | null
          lifecycle_stage?: string
          metadata?: Json
          notes?: string | null
          onboarding_progress?: Json
          pipeline_value?: number
          primary_contact_email?: string
          primary_contact_name?: string | null
          primary_service_type?: string | null
          revenue_stage?: string
          source?: string
          status?: string
          updated_at?: string
          vespa_last_activity_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      cms_about: {
        Row: {
          content: string
          created_at: string
          display_order: number
          id: string
          section_key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          display_order?: number
          id?: string
          section_key: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          display_order?: number
          id?: string
          section_key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cms_how_it_works: {
        Row: {
          created_at: string
          description: string
          details: Json | null
          icon: string | null
          id: string
          step_number: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          details?: Json | null
          icon?: string | null
          id?: string
          step_number: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          details?: Json | null
          icon?: string | null
          id?: string
          step_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_projects: {
        Row: {
          category: string
          client_location: string | null
          client_tagline: string | null
          cms_submission_id: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          preview_gif_url: string | null
          preview_image_url: string | null
          profile_data: Json | null
          published: boolean
          timeline: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string
          client_location?: string | null
          client_tagline?: string | null
          cms_submission_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          preview_gif_url?: string | null
          preview_image_url?: string | null
          profile_data?: Json | null
          published?: boolean
          timeline?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          client_location?: string | null
          client_tagline?: string | null
          cms_submission_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          preview_gif_url?: string | null
          preview_image_url?: string | null
          profile_data?: Json | null
          published?: boolean
          timeline?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_projects_cms_submission_id_fkey"
            columns: ["cms_submission_id"]
            isOneToOne: false
            referencedRelation: "cms_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_submissions: {
        Row: {
          brand_status: string | null
          business_goals: string | null
          company_name: string
          competitors: string | null
          created_at: string
          email: string
          existing_assets: string | null
          id: string
          industry: string | null
          status: string
          target_audience: string | null
          tone_preferences: string | null
          website: string | null
        }
        Insert: {
          brand_status?: string | null
          business_goals?: string | null
          company_name: string
          competitors?: string | null
          created_at?: string
          email: string
          existing_assets?: string | null
          id?: string
          industry?: string | null
          status?: string
          target_audience?: string | null
          tone_preferences?: string | null
          website?: string | null
        }
        Update: {
          brand_status?: string | null
          business_goals?: string | null
          company_name?: string
          competitors?: string | null
          created_at?: string
          email?: string
          existing_assets?: string | null
          id?: string
          industry?: string | null
          status?: string
          target_audience?: string | null
          tone_preferences?: string | null
          website?: string | null
        }
        Relationships: []
      }
      cms_terms: {
        Row: {
          content: string
          created_at: string
          display_order: number
          id: string
          section_title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          display_order?: number
          id?: string
          section_title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          display_order?: number
          id?: string
          section_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_work_media: {
        Row: {
          created_at: string
          created_by: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          media_type: string
          work_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          media_type: string
          work_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          media_type?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_work_media_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "cms_works"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_work_updates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          title: string
          work_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
          work_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_work_updates_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "cms_works"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_works: {
        Row: {
          category: string
          client_id: string | null
          client_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          is_public: boolean
          progress: number
          project_id: string | null
          public_token: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          client_id?: string | null
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_public?: boolean
          progress?: number
          project_id?: string | null
          public_token?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          client_id?: string | null
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_public?: boolean
          progress?: number
          project_id?: string | null
          public_token?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_works_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_works_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "cms_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deliverables: {
        Row: {
          brand_id: string | null
          category: string
          content: Json
          created_at: string
          format: string
          id: string
          module: string | null
          parent_id: string | null
          published_at: string | null
          section: string
          source_agent: string | null
          status: string
          storage_paths: string[] | null
          title: string
          version: number
        }
        Insert: {
          brand_id?: string | null
          category: string
          content?: Json
          created_at?: string
          format?: string
          id?: string
          module?: string | null
          parent_id?: string | null
          published_at?: string | null
          section: string
          source_agent?: string | null
          status?: string
          storage_paths?: string[] | null
          title: string
          version?: number
        }
        Update: {
          brand_id?: string | null
          category?: string
          content?: Json
          created_at?: string
          format?: string
          id?: string
          module?: string | null
          parent_id?: string | null
          published_at?: string | null
          section?: string
          source_agent?: string | null
          status?: string
          storage_paths?: string[] | null
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliverables_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "deliverables"
            referencedColumns: ["id"]
          },
        ]
      }
      next_actions: {
        Row: {
          assigned_to: string | null
          brand_id: string | null
          created_at: string
          created_by_agent: string | null
          due_at: string | null
          id: string
          module: string | null
          path: string
          priority: string
          rationale: string | null
          section: string | null
          status: string
          title: string
        }
        Insert: {
          assigned_to?: string | null
          brand_id?: string | null
          created_at?: string
          created_by_agent?: string | null
          due_at?: string | null
          id?: string
          module?: string | null
          path: string
          priority?: string
          rationale?: string | null
          section?: string | null
          status?: string
          title: string
        }
        Update: {
          assigned_to?: string | null
          brand_id?: string | null
          created_at?: string
          created_by_agent?: string | null
          due_at?: string | null
          id?: string
          module?: string | null
          path?: string
          priority?: string
          rationale?: string | null
          section?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "next_actions_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_inputs: {
        Row: {
          brand_id: string | null
          completeness_score: number
          id: string
          input_data: Json
          module: string
          section: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          brand_id?: string | null
          completeness_score?: number
          id?: string
          input_data?: Json
          module: string
          section: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          brand_id?: string | null
          completeness_score?: number
          id?: string
          input_data?: Json
          module?: string
          section?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_inputs_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      physical_asset_workflows: {
        Row: {
          asset_category: string
          asset_name: string
          client_id: string
          created_at: string
          delivery_eta_days: number | null
          design_preview_url: string | null
          design_reference_url: string | null
          due_date: string | null
          id: string
          notes: string | null
          production_status: string
          progress: number
          updated_at: string
        }
        Insert: {
          asset_category: string
          asset_name: string
          client_id: string
          created_at?: string
          delivery_eta_days?: number | null
          design_preview_url?: string | null
          design_reference_url?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          production_status?: string
          progress?: number
          updated_at?: string
        }
        Update: {
          asset_category?: string
          asset_name?: string
          client_id?: string
          created_at?: string
          delivery_eta_days?: number | null
          design_preview_url?: string | null
          design_reference_url?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          production_status?: string
          progress?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "physical_asset_workflows_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physical_asset_workflows_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
        ]
      }
      dags_projects: {
        Row: {
          canvas_data: Json
          created_at: string
          id: string
          name: string
          project_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          canvas_data?: Json
          created_at?: string
          id?: string
          name: string
          project_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          canvas_data?: Json
          created_at?: string
          id?: string
          name?: string
          project_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          impact_score: number | null
          probability_pct: number
          recommended_service: string | null
          stage: string
          status: string
          title: string
          updated_at: string
          value_estimate: number
          vespa_identified: boolean
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          impact_score?: number | null
          probability_pct?: number
          recommended_service?: string | null
          stage?: string
          status?: string
          title: string
          updated_at?: string
          value_estimate?: number
          vespa_identified?: boolean
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          impact_score?: number | null
          probability_pct?: number
          recommended_service?: string | null
          stage?: string
          status?: string
          title?: string
          updated_at?: string
          value_estimate?: number
          vespa_identified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          sign_in_disabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          sign_in_disabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          sign_in_disabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_social_posts: {
        Row: {
          caption: string
          created_at: string
          dags_project_id: string
          external_post_id: string | null
          id: string
          media_storage_path: string | null
          platform: string
          publish_error: string | null
          published_at: string | null
          scheduled_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string
          created_at?: string
          dags_project_id: string
          external_post_id?: string | null
          id?: string
          media_storage_path?: string | null
          platform: string
          publish_error?: string | null
          published_at?: string | null
          scheduled_at: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string
          created_at?: string
          dags_project_id?: string
          external_post_id?: string | null
          id?: string
          media_storage_path?: string | null
          platform?: string
          publish_error?: string | null
          published_at?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_social_posts_dags_project_id_fkey"
            columns: ["dags_project_id"]
            isOneToOne: false
            referencedRelation: "dags_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      social_connection_secrets: {
        Row: {
          access_token: string
          created_at: string
          extra: Json
          page_id: string | null
          platform: string
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          extra?: Json
          page_id?: string | null
          platform: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          extra?: Json
          page_id?: string | null
          platform?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_connections: {
        Row: {
          account_label: string | null
          connected: boolean
          created_at: string
          id: string
          platform: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_label?: string | null
          connected?: boolean
          created_at?: string
          id?: string
          platform: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_label?: string | null
          connected?: boolean
          created_at?: string
          id?: string
          platform?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          respondent_email: string | null
          respondent_name: string | null
          responses: Json
          score: number | null
          sentiment: Json
          status: string
          submitted_at: string
          survey_id: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          respondent_email?: string | null
          respondent_name?: string | null
          responses?: Json
          score?: number | null
          sentiment?: Json
          status?: string
          submitted_at?: string
          survey_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          respondent_email?: string | null
          respondent_name?: string | null
          responses?: Json
          score?: number | null
          sentiment?: Json
          status?: string
          submitted_at?: string
          survey_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          campaign_id: string | null
          client_id: string
          created_at: string
          delivery_channels: Json
          description: string | null
          id: string
          metadata: Json
          questions: Json
          sent_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          client_id: string
          created_at?: string
          delivery_channels?: Json
          description?: string | null
          id?: string
          metadata?: Json
          questions?: Json
          sent_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          client_id?: string
          created_at?: string
          delivery_channels?: Json
          description?: string | null
          id?: string
          metadata?: Json
          questions?: Json
          sent_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surveys_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          can_edit: boolean
          can_view: boolean
          created_at: string
          id: string
          section: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          section: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          section?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_ai_output_history: {
        Row: {
          ai_output_type: string | null
          ai_status: string | null
          client_id: string | null
          created_at: string | null
          id: string | null
          impact_score: number | null
          label: string | null
          source_table: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      v_automation_run_detail: {
        Row: {
          automation_id: string | null
          automation_name: string | null
          client_company: string | null
          client_id: string | null
          client_submission_id: string | null
          created_at: string | null
          error_message: string | null
          finished_at: string | null
          id: string | null
          input_context: Json | null
          output_context: Json | null
          run_key: string | null
          run_status: string | null
          started_at: string | null
          trigger_event: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_runs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_runs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "automation_runs_client_submission_id_fkey"
            columns: ["client_submission_id"]
            isOneToOne: false
            referencedRelation: "client_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      v_reporting_client_health: {
        Row: {
          client_id: string | null
          company_name: string | null
          has_used_vespa: boolean | null
          health_band: string | null
          health_calculated_at: string | null
          health_score: number | null
          lifecycle_stage: string | null
          pipeline_value: number | null
          primary_service_type: string | null
          revenue_stage: string | null
          upsell_calculated_at: string | null
          upsell_score: number | null
          vespa_last_activity_at: string | null
        }
        Relationships: []
      }
      v_reporting_opportunity_list: {
        Row: {
          client_id: string | null
          company_name: string | null
          created_at: string | null
          description: string | null
          id: string | null
          impact_score: number | null
          probability_pct: number | null
          recommended_service: string | null
          stage: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          value_estimate: number | null
          vespa_identified: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_reporting_client_health"
            referencedColumns: ["client_id"]
          },
        ]
      }
    }
    Functions: {
      assert_admin_user: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      rpc_reporting_bundle: {
        Args: {
          p_from: string
          p_service_type?: string
          p_to: string
          p_vespa_feature?: string
        }
        Returns: Json
      }
      user_can_edit_section: { Args: { p_section: string }; Returns: boolean }
      user_can_view_section: { Args: { p_section: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "editor" | "viewer"
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
      app_role: ["admin", "user", "editor", "viewer"],
    },
  },
} as const
