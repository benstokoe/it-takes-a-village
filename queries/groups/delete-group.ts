import { SupabaseClient } from '@supabase/supabase-js';

export default async function deleteGroup(client: SupabaseClient, groupId: string) {
  return client.from('groups').delete().eq('id', groupId);
}
