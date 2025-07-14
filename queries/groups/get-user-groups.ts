import { SupabaseClient } from '@supabase/supabase-js';
import getGroupsWithMembers from './get-groups-with-members';

export default async function getUserGroups(client: SupabaseClient, userId: string) {
  const { data: userGroups, error: userGroupsError } = await client
    .from('group_members')
    .select('group_id')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (userGroupsError) {
    throw new Error('Failed to fetch user groups');
  }

  if (!userGroups || userGroups.length === 0) {
    return [];
  }

  const groupIds = userGroups.map((ug) => ug.group_id);
  const { data, error: fetchError } = await getGroupsWithMembers(client, groupIds);

  if (fetchError) {
    throw new Error('Failed to fetch groups with members');
  }

  return data || [];
}
