export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      availability_requests: {
        Row: {
          created_at: string | null;
          created_by: string;
          description: string | null;
          end_time: string | null;
          family_id: string;
          id: string;
          is_recurring: boolean | null;
          is_urgent: boolean | null;
          location: string | null;
          recurring_pattern: Json | null;
          request_type: Database['public']['Enums']['request_type'];
          requested_date: string;
          start_time: string | null;
          status: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          description?: string | null;
          end_time?: string | null;
          family_id: string;
          id?: string;
          is_recurring?: boolean | null;
          is_urgent?: boolean | null;
          location?: string | null;
          recurring_pattern?: Json | null;
          request_type: Database['public']['Enums']['request_type'];
          requested_date: string;
          start_time?: string | null;
          status?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          description?: string | null;
          end_time?: string | null;
          family_id?: string;
          id?: string;
          is_recurring?: boolean | null;
          is_urgent?: boolean | null;
          location?: string | null;
          recurring_pattern?: Json | null;
          request_type?: Database['public']['Enums']['request_type'];
          requested_date?: string;
          start_time?: string | null;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'availability_requests_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'availability_requests_family_id_fkey';
            columns: ['family_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
        ];
      };
      availability_responses: {
        Row: {
          available_from: string | null;
          available_until: string | null;
          id: string;
          notes: string | null;
          request_id: string;
          responded_at: string | null;
          responder_id: string;
          response: Database['public']['Enums']['response_type'];
          updated_at: string | null;
        };
        Insert: {
          available_from?: string | null;
          available_until?: string | null;
          id?: string;
          notes?: string | null;
          request_id: string;
          responded_at?: string | null;
          responder_id: string;
          response: Database['public']['Enums']['response_type'];
          updated_at?: string | null;
        };
        Update: {
          available_from?: string | null;
          available_until?: string | null;
          id?: string;
          notes?: string | null;
          request_id?: string;
          responded_at?: string | null;
          responder_id?: string;
          response?: Database['public']['Enums']['response_type'];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'availability_responses_request_id_fkey';
            columns: ['request_id'];
            isOneToOne: false;
            referencedRelation: 'availability_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'availability_responses_responder_id_fkey';
            columns: ['responder_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      group_members: {
        Row: {
          group_id: string;
          id: string;
          is_active: boolean | null;
          joined_at: string | null;
          relationship_label: string;
          role: string | null;
          user_id: string;
        };
        Insert: {
          group_id: string;
          id?: string;
          is_active?: boolean | null;
          joined_at?: string | null;
          relationship_label: string;
          role?: string | null;
          user_id: string;
        };
        Update: {
          group_id?: string;
          id?: string;
          is_active?: boolean | null;
          joined_at?: string | null;
          relationship_label?: string;
          role?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'family_members_family_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'family_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      groups: {
        Row: {
          created_at: string | null;
          created_by: string;
          description: string | null;
          id: string;
          invite_code: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          description?: string | null;
          id?: string;
          invite_code: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          description?: string | null;
          id?: string;
          invite_code?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'families_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          notification_preferences: Json | null;
          phone_number: string | null;
          timezone: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          notification_preferences?: Json | null;
          phone_number?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          notification_preferences?: Json | null;
          phone_number?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      request_messages: {
        Row: {
          created_at: string | null;
          id: string;
          message_text: string;
          request_id: string;
          sender_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message_text: string;
          request_id: string;
          sender_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message_text?: string;
          request_id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'request_messages_request_id_fkey';
            columns: ['request_id'];
            isOneToOne: false;
            referencedRelation: 'availability_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'request_messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      request_recipients: {
        Row: {
          id: string;
          recipient_id: string;
          request_id: string;
          sent_at: string | null;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          request_id: string;
          sent_at?: string | null;
        };
        Update: {
          id?: string;
          recipient_id?: string;
          request_id?: string;
          sent_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'request_recipients_recipient_id_fkey';
            columns: ['recipient_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'request_recipients_request_id_fkey';
            columns: ['request_id'];
            isOneToOne: false;
            referencedRelation: 'availability_requests';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_invite_code: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      request_type:
        | 'childcare'
        | 'event_help'
        | 'emergency'
        | 'social_visit'
        | 'transportation'
        | 'general_support';
      response_type: 'yes' | 'no' | 'maybe';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      request_type: [
        'childcare',
        'event_help',
        'emergency',
        'social_visit',
        'transportation',
        'general_support',
      ],
      response_type: ['yes', 'no', 'maybe'],
    },
  },
} as const;

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Group = Database['public']['Tables']['groups']['Row'];
export type GroupMember = Database['public']['Tables']['group_members']['Row'];
export type AvailabilityRequest = Database['public']['Tables']['availability_requests']['Row'];
export type AvailabilityResponse = Database['public']['Tables']['availability_responses']['Row'];
export type RequestMessage = Database['public']['Tables']['request_messages']['Row'];
export type RequestRecipient = Database['public']['Tables']['request_recipients']['Row'];
