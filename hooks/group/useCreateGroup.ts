import createGroupQuery from '@/queries/groups/create-group';
import { supabase } from '@/utils/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GROUPS_QUERY_KEY } from './constants';
import { useAuth } from '@/utils/useAuth';

export default function useCreateGroup() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const createGroupMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!userId) throw new Error('User must be authenticated');

      const { data } = await createGroupQuery(supabase, userId, name, description);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
    },
  });

  return {
    createGroup: createGroupMutation.mutateAsync,
    isCreatingGroup: createGroupMutation.isPending,
  };
}
