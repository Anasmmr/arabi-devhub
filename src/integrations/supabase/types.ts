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
      certificates: {
        Row: {
          course_id: string
          department_id: string
          email_sent: boolean
          id: string
          issued_at: string
          serial: string
          status: string
          user_id: string
        }
        Insert: {
          course_id: string
          department_id: string
          email_sent?: boolean
          id?: string
          issued_at?: string
          serial: string
          status?: string
          user_id: string
        }
        Update: {
          course_id?: string
          department_id?: string
          email_sent?: boolean
          id?: string
          issued_at?: string
          serial?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      course_completions: {
        Row: {
          completed_at: string
          course_id: string
          id: string
          source: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          course_id: string
          id?: string
          source?: string
          user_id: string
        }
        Update: {
          completed_at?: string
          course_id?: string
          id?: string
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_completions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          department_id: string
          description_ar: string
          id: string
          points: number
          satr_url: string
          sort_order: number
          title_ar: string
        }
        Insert: {
          created_at?: string
          department_id: string
          description_ar: string
          id?: string
          points?: number
          satr_url: string
          sort_order?: number
          title_ar: string
        }
        Update: {
          created_at?: string
          department_id?: string
          description_ar?: string
          id?: string
          points?: number
          satr_url?: string
          sort_order?: number
          title_ar?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          accent: string
          created_at: string
          icon: string
          id: string
          intro_ar: string
          learn_items_ar: string[]
          name_ar: string
          name_en: string
          short_description_ar: string
          slug: string
          sort_order: number
        }
        Insert: {
          accent?: string
          created_at?: string
          icon?: string
          id?: string
          intro_ar: string
          learn_items_ar?: string[]
          name_ar: string
          name_en: string
          short_description_ar: string
          slug: string
          sort_order?: number
        }
        Update: {
          accent?: string
          created_at?: string
          icon?: string
          id?: string
          intro_ar?: string
          learn_items_ar?: string[]
          name_ar?: string
          name_en?: string
          short_description_ar?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      founders: {
        Row: {
          bio_ar: string
          github_url: string | null
          id: string
          image_url: string | null
          initial: string
          linkedin_url: string | null
          name: string
          role_ar: string
          sort_order: number
          x_url: string | null
        }
        Insert: {
          bio_ar: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          initial?: string
          linkedin_url?: string | null
          name: string
          role_ar: string
          sort_order?: number
          x_url?: string | null
        }
        Update: {
          bio_ar?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          initial?: string
          linkedin_url?: string | null
          name?: string
          role_ar?: string
          sort_order?: number
          x_url?: string | null
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          amount: number
          created_at: string
          department_id: string | null
          id: string
          kind: string
          reason_ar: string
          reference: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          department_id?: string | null
          id?: string
          kind?: string
          reason_ar: string
          reference: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          department_id?: string | null
          id?: string
          kind?: string
          reason_ar?: string
          reference?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          full_name: string
          github_url: string | null
          headline: string | null
          id: string
          is_demo: boolean
          linkedin_url: string | null
          total_points: number
          updated_at: string
          website_url: string | null
          whatsapp_phone: string | null
          x_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          github_url?: string | null
          headline?: string | null
          id: string
          is_demo?: boolean
          linkedin_url?: string | null
          total_points?: number
          updated_at?: string
          website_url?: string | null
          whatsapp_phone?: string | null
          x_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          github_url?: string | null
          headline?: string | null
          id?: string
          is_demo?: boolean
          linkedin_url?: string | null
          total_points?: number
          updated_at?: string
          website_url?: string | null
          whatsapp_phone?: string | null
          x_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          p_amount: number
          p_department_id: string
          p_kind: string
          p_reason_ar: string
          p_reference: string
          p_user_id: string
        }
        Returns: boolean
      }
      complete_course: {
        Args: { p_course_id: string; p_user_id: string }
        Returns: Json
      }
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
    Enums: {},
  },
} as const
