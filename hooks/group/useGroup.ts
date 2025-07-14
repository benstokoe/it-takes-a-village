import { supabase } from '@/utils/supabase';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UserGroup } from './types';

export function useGroup(groupId: string): UseQueryResult<UserGroup, Error> {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      if (!groupId) return null;

      const { data, error } = await supabase
        .from('groups')
        .select(
          `*,
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
        .eq('id', groupId)
        .eq('group_members.is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
  });
}
