import { SupabaseClient } from '@supabase/supabase-js';

export default async function getGroupsWithMembers(client: SupabaseClient, groupIds: string[]) {
  return client
    .from('groups')
    .select(
      `
      *,
      group_members(
        id,
        group_id,
        user_id,
        relationship_label,
        role,
        joined_at,
        is_active,
        profiles(
          id,
          email,
          full_name,
          avatar_url
        )
      )
    `
    )
    .in('id', groupIds)
    .eq('group_members.is_active', true)
    .order('created_at', { ascending: false });
}
