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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      exam_date_revisions: {
        Row: {
          created_at: string
          end_datetime: string | null
          event_type: string
          exam_slug: string
          id: string
          is_extended: boolean
          is_tentative: boolean
          label: string | null
          note: string | null
          source_url: string
          start_datetime: string | null
          status: string
          updated_at: string
          verified_at: string | null
          year: number
        }
        Insert: {
          created_at?: string
          end_datetime?: string | null
          event_type: string
          exam_slug: string
          id?: string
          is_extended?: boolean
          is_tentative?: boolean
          label?: string | null
          note?: string | null
          source_url: string
          start_datetime?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          year: number
        }
        Update: {
          created_at?: string
          end_datetime?: string | null
          event_type?: string
          exam_slug?: string
          id?: string
          is_extended?: boolean
          is_tentative?: boolean
          label?: string | null
          note?: string | null
          source_url?: string
          start_datetime?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          year?: number
        }
        Relationships: []
      }
      exam_notifications: {
        Row: {
          content_hash: string
          created_at: string
          detected_at: string
          document_url: string | null
          exam_id: string
          id: string
          is_new: boolean
          is_verified: boolean
          last_seen_at: string
          notification_type: string
          official_url: string
          published_at: string | null
          source_id: string
          status: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          content_hash: string
          created_at?: string
          detected_at?: string
          document_url?: string | null
          exam_id: string
          id?: string
          is_new?: boolean
          is_verified?: boolean
          last_seen_at?: string
          notification_type?: string
          official_url: string
          published_at?: string | null
          source_id: string
          status?: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          content_hash?: string
          created_at?: string
          detected_at?: string
          document_url?: string | null
          exam_id?: string
          id?: string
          is_new?: boolean
          is_verified?: boolean
          last_seen_at?: string
          notification_type?: string
          official_url?: string
          published_at?: string | null
          source_id?: string
          status?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_notifications_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "official_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_revisions: {
        Row: {
          end_datetime: string | null
          event_type: string
          exam_slug: string
          id: number
          is_extended: boolean
          is_tentative: boolean
          label: string | null
          note: string | null
          removed: boolean
          revised_at: string
          source_url: string | null
          start_datetime: string | null
          year: number
        }
        Insert: {
          end_datetime?: string | null
          event_type: string
          exam_slug: string
          id?: number
          is_extended?: boolean
          is_tentative?: boolean
          label?: string | null
          note?: string | null
          removed?: boolean
          revised_at?: string
          source_url?: string | null
          start_datetime?: string | null
          year: number
        }
        Update: {
          end_datetime?: string | null
          event_type?: string
          exam_slug?: string
          id?: number
          is_extended?: boolean
          is_tentative?: boolean
          label?: string | null
          note?: string | null
          removed?: boolean
          revised_at?: string
          source_url?: string | null
          start_datetime?: string | null
          year?: number
        }
        Relationships: []
      }
      exam_sources: {
        Row: {
          application_url: string
          conducting_body: string
          exam_slug: string
          official_url: string
          source_name: string
          updated_at: string
        }
        Insert: {
          application_url: string
          conducting_body: string
          exam_slug: string
          official_url: string
          source_name: string
          updated_at?: string
        }
        Update: {
          application_url?: string
          conducting_body?: string
          exam_slug?: string
          official_url?: string
          source_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      exam_update_history: {
        Row: {
          created_at: string
          detected_at: string
          exam_id: string
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          source_id: string
          source_url: string
        }
        Insert: {
          created_at?: string
          detected_at?: string
          exam_id: string
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          source_id: string
          source_url: string
        }
        Update: {
          created_at?: string
          detected_at?: string
          exam_id?: string
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          source_id?: string
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_update_history_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "official_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      government_exams: {
        Row: {
          application_deadline: string
          category: string
          code: string
          conducting_body: string
          eligibility: string
          exam_date: string
          id: number
          is_tentative: boolean
          mode: string
          name: string
          official_url: string
          slug: string
          source_url: string | null
          state: string
          tags: string[]
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          application_deadline: string
          category: string
          code: string
          conducting_body: string
          eligibility: string
          exam_date: string
          id?: number
          is_tentative?: boolean
          mode: string
          name: string
          official_url: string
          slug: string
          source_url?: string | null
          state: string
          tags?: string[]
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          application_deadline?: string
          category?: string
          code?: string
          conducting_body?: string
          eligibility?: string
          exam_date?: string
          id?: number
          is_tentative?: boolean
          mode?: string
          name?: string
          official_url?: string
          slug?: string
          source_url?: string | null
          state?: string
          tags?: string[]
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      official_sources: {
        Row: {
          check_interval_minutes: number
          created_at: string
          etag: string | null
          exam_id: string | null
          id: string
          last_checked_at: string | null
          last_content_hash: string | null
          last_modified: string | null
          last_success_at: string | null
          name: string
          organization: string
          source_type: string
          source_url: string
          status: string
          updated_at: string
        }
        Insert: {
          check_interval_minutes?: number
          created_at?: string
          etag?: string | null
          exam_id?: string | null
          id?: string
          last_checked_at?: string | null
          last_content_hash?: string | null
          last_modified?: string | null
          last_success_at?: string | null
          name: string
          organization: string
          source_type?: string
          source_url: string
          status?: string
          updated_at?: string
        }
        Update: {
          check_interval_minutes?: number
          created_at?: string
          etag?: string | null
          exam_id?: string | null
          id?: string
          last_checked_at?: string | null
          last_content_hash?: string | null
          last_modified?: string | null
          last_success_at?: string | null
          name?: string
          organization?: string
          source_type?: string
          source_url?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      source_monitor_logs: {
        Row: {
          checked_at: string
          duration_ms: number
          error_message: string | null
          http_status: number | null
          id: string
          items_found: number
          source_id: string
          status: string
        }
        Insert: {
          checked_at?: string
          duration_ms?: number
          error_message?: string | null
          http_status?: number | null
          id?: string
          items_found?: number
          source_id: string
          status: string
        }
        Update: {
          checked_at?: string
          duration_ms?: number
          error_message?: string | null
          http_status?: number | null
          id?: string
          items_found?: number
          source_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_monitor_logs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "official_sources"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
