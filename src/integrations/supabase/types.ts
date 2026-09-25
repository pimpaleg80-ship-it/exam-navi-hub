export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      exam_sources: {
        Row: {
          exam_slug: string;
          official_url: string;
          application_url: string;
          conducting_body: string;
          source_name: string;
          updated_at: string;
        };
        Insert: {
          exam_slug: string;
          official_url: string;
          application_url: string;
          conducting_body: string;
          source_name: string;
          updated_at?: string;
        };
        Update: {
          exam_slug?: string;
          official_url?: string;
          application_url?: string;
          conducting_body?: string;
          source_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exam_revisions: {
        Row: {
          exam_slug: string;
          year: number;
          event_type: string;
          label: string | null;
          start_datetime: string | null;
          end_datetime: string | null;
          is_tentative: boolean | null;
          is_extended: boolean | null;
          removed: boolean | null;
          revised_at: string;
          source_url: string | null;
          note: string | null;
        };
        Insert: {
          exam_slug: string;
          year: number;
          event_type: string;
          label?: string | null;
          start_datetime?: string | null;
          end_datetime?: string | null;
          is_tentative?: boolean | null;
          is_extended?: boolean | null;
          removed?: boolean | null;
          revised_at?: string;
          source_url?: string | null;
          note?: string | null;
        };
        Update: {
          exam_slug?: string;
          year?: number;
          event_type?: string;
          label?: string | null;
          start_datetime?: string | null;
          end_datetime?: string | null;
          is_tentative?: boolean | null;
          is_extended?: boolean | null;
          removed?: boolean | null;
          revised_at?: string;
          source_url?: string | null;
          note?: string | null;
        };
        Relationships: [];
      };
      government_exams: {
        Row: {
          id: number;
          slug: string;
          code: string;
          name: string;
          conducting_body: string;
          category: string;
          state: string;
          application_deadline: string;
          exam_date: string;
          mode: string;
          eligibility: string;
          official_url: string;
          tags: string[];
          is_tentative: boolean;
          source_url: string | null;
          verified_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          code: string;
          name: string;
          conducting_body: string;
          category: string;
          state: string;
          application_deadline: string;
          exam_date: string;
          mode: string;
          eligibility: string;
          official_url: string;
          tags?: string[];
          is_tentative?: boolean;
          source_url?: string | null;
          verified_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          code?: string;
          name?: string;
          conducting_body?: string;
          category?: string;
          state?: string;
          application_deadline?: string;
          exam_date?: string;
          mode?: string;
          eligibility?: string;
          official_url?: string;
          tags?: string[];
          is_tentative?: boolean;
          source_url?: string | null;
          verified_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
