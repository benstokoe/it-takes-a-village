import { SupabaseClient } from '@supabase/supabase-js';

export default async function inviteToGroup(
  client: SupabaseClient,
  groupId: string,
  creatorId: string,
  name: string
) {
  return client.rpc('group_invitations', {
    group_id: groupId,
    creator_id: creatorId,
    name,
  });
}
