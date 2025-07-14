import getUserGroups from '@/queries/groups/get-user-groups';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/utils/useAuth';
import { useQuery } from '@tanstack/react-query';
import { GROUPS_QUERY_KEY } from './constants';
import { UserGroup } from './types';

type UseGroupsReturn = {
  groups: UserGroup[];
  isLoading: boolean;
  error: string | null;
};

export function useGroups(): UseGroupsReturn {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const {
    data: groups = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: GROUPS_QUERY_KEY,
    queryFn: async (): Promise<UserGroup[]> => {
      if (!userId) return [];

      return getUserGroups(supabase, userId);
    },
    enabled: !!userId,
  });

  return {
    groups,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'An error occurred') : null,
  };
}
