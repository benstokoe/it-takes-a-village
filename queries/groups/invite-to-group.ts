import { SupabaseClient } from '@supabase/supabase-js';

export default async function inviteToGroup(
  client: SupabaseClient,
  groupId: string,
  creatorId: string,
  email: string
) {
  return { data: null, error: null };
}
