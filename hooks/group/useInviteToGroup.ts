import { useAuth } from '@/utils/useAuth';
import { useMutation } from '@tanstack/react-query';
import inviteToGroupQuery from '@/queries/groups/invite-to-group';
import { supabase } from '@/utils/supabase';

export function useInviteToGroup() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const inviteToGroupMutation = useMutation({
    mutationFn: async ({
      groupId,
      email,
      relationship,
    }: {
      groupId: string;
      email: string;
      relationship: string;
    }) => {
      if (!userId) throw new Error('User must be authenticated');

      const { data, error } = await inviteToGroupQuery(
        supabase,
        groupId,
        userId,
        email,
        relationship
      );
      if (error) throw error;
      return data;
    },
  });

  return {
    inviteToGroup: inviteToGroupMutation.mutateAsync,
    isInviting: inviteToGroupMutation.isPending,
  };
}
