import { SupabaseClient } from '@supabase/supabase-js';

export default async function removeGroupMember(
  client: SupabaseClient,
  memberId: string,
  groupId: string
) {
  return client.from('group_members').delete().eq('id', memberId).eq('group_id', groupId);
}
