export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      "11s_discussions": {
        Row: {
          created_at: string;
          follow_ups: string[];
          id: string;
          mood: string;
          occurred_at: string;
          person_id: string;
          summary: string;
          title: string;
          topics: string[];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          follow_ups?: string[];
          id?: string;
          mood: string;
          occurred_at: string;
          person_id: string;
          summary: string;
          title: string;
          topics?: string[];
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          follow_ups?: string[];
          id?: string;
          mood?: string;
          occurred_at?: string;
          person_id?: string;
          summary?: string;
          title?: string;
          topics?: string[];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "11s_discussions_person_owner_fkey";
            columns: ["person_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "11s_people";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      "11s_people": {
        Row: {
          /** Optional emoji avatar string (legacy column name avatar_path). */
          avatar_path: string | null;
          background: string;
          color: string;
          created_at: string;
          id: string;
          last_meeting_at: string | null;
          last_notes: string;
          linkedin_url: string;
          name: string;
          notes: string;
          organization: string;
          prep_opening: string | null;
          prep_source: string | null;
          relationship: string;
          role: string;
          sort_order: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_path?: string | null;
          background?: string;
          color: string;
          created_at?: string;
          id?: string;
          last_meeting_at?: string | null;
          last_notes?: string;
          linkedin_url?: string;
          name: string;
          notes?: string;
          organization?: string;
          prep_opening?: string | null;
          prep_source?: string | null;
          relationship: string;
          role?: string;
          sort_order?: number;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          avatar_path?: string | null;
          background?: string;
          color?: string;
          created_at?: string;
          id?: string;
          last_meeting_at?: string | null;
          last_notes?: string;
          linkedin_url?: string;
          name?: string;
          notes?: string;
          organization?: string;
          prep_opening?: string | null;
          prep_source?: string | null;
          relationship?: string;
          role?: string;
          sort_order?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      "11s_preferences": {
        Row: {
          brag_doc: string;
          career_direction: string;
          career_target_role: string;
          career_timeline: string;
          context_bank: string;
          created_at: string;
          current_period_end: string | null;
          general_prep_opening: string | null;
          general_prep_source: string | null;
          locale: string;
          plan: string;
          referral_redeemed_count: number;
          stripe_customer_id: string | null;
          subscription_status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          brag_doc?: string;
          career_direction?: string;
          career_target_role?: string;
          career_timeline?: string;
          context_bank?: string;
          created_at?: string;
          current_period_end?: string | null;
          general_prep_opening?: string | null;
          general_prep_source?: string | null;
          locale?: string;
          plan?: string;
          referral_redeemed_count?: number;
          stripe_customer_id?: string | null;
          subscription_status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          brag_doc?: string;
          career_direction?: string;
          career_target_role?: string;
          career_timeline?: string;
          context_bank?: string;
          created_at?: string;
          current_period_end?: string | null;
          general_prep_opening?: string | null;
          general_prep_source?: string | null;
          locale?: string;
          plan?: string;
          referral_redeemed_count?: number;
          stripe_customer_id?: string | null;
          subscription_status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      "11s_referrals": {
        Row: {
          created_at: string;
          id: string;
          referred_user_id: string;
          referrer_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          referred_user_id: string;
          referrer_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          referred_user_id?: string;
          referrer_id?: string;
        };
        Relationships: [];
      };
      "11s_prep_usage": {
        Row: {
          created_at: string;
          id: string;
          person_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          person_id?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          person_id?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      "11s_prep_ideas": {
        Row: {
          category: string;
          created_at: string;
          id: string;
          kind: string;
          person_id: string | null;
          prompt: string;
          rationale: string;
          sort_order: number;
          title: string;
          user_id: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          kind?: string;
          person_id?: string | null;
          prompt: string;
          rationale: string;
          sort_order?: number;
          title: string;
          user_id?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          kind?: string;
          person_id?: string | null;
          prompt?: string;
          rationale?: string;
          sort_order?: number;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "11s_prep_ideas_person_owner_fkey";
            columns: ["person_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "11s_people";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      "11s_career_needs": {
        Row: {
          body: string;
          created_at: string;
          id: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      "11s_redeem_referral_credit": {
        Args: { p_user_id: string };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;
