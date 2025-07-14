import deleteGroupQuery from '@/queries/groups/delete-group';
import { supabase } from '@/utils/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GROUPS_QUERY_KEY } from './constants';

export default function useDeleteGroup() {
  const queryClient = useQueryClient();

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await deleteGroupQuery(supabase, groupId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
    },
  });

  return {
    deleteGroup: deleteGroupMutation.mutateAsync,
    isDeletingGroup: deleteGroupMutation.isPending,
  };
}
