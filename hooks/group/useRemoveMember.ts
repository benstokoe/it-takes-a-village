import { useMutation, useQueryClient } from '@tanstack/react-query';
import removeGroupMemberQuery from '@/queries/groups/remove-group-member';
import { supabase } from '@/utils/supabase';

export default function useRemoveMember(groupId: string) {
  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: async ({ memberId }: { memberId: string }) => {
      const { error } = await removeGroupMemberQuery(supabase, memberId, groupId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });

  return {
    removeMember: removeMemberMutation.mutateAsync,
    isRemovingMember: removeMemberMutation.isPending,
  };
}
