import { Database } from '@/supabase/database.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { type Session, type AuthError } from '@supabase/supabase-js';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Group = Database['public']['Tables']['groups']['Row'];
export type GroupMember = Database['public']['Tables']['group_members']['Row'];
export type GroupInvitation = Database['public']['Tables']['group_invitations']['Row'];
export type AvailabilityRequest = Database['public']['Tables']['availability_requests']['Row'];
export type AvailabilityResponse = Database['public']['Tables']['availability_responses']['Row'];
export type RequestMessage = Database['public']['Tables']['request_messages']['Row'];
export type RequestRecipient = Database['public']['Tables']['request_recipients']['Row'];

/**
 * Tells Supabase to autorefresh the session while the application
 * is in the foreground. (Docs: https://supabase.com/docs/reference/javascript/auth-startautorefresh)
 */
AppState.addEventListener('change', (nextAppState) => {
  if (nextAppState === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
