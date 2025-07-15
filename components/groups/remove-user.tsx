import useRemoveMember from '@/hooks/group/useRemoveMember';
import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { Button } from '../button';
import { showConfirmAlert, useToast } from '../ui';

type RemoveUserProps = {
  memberId: string;
  memberName: string;
  groupId: string;
};

export default function RemoveUser({ memberId, memberName, groupId }: RemoveUserProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { removeMember, isRemovingMember } = useRemoveMember(groupId);

  async function onConfirm() {
    try {
      await removeMember({ memberId });

      toast({
        title: 'User removed',
        description: `${memberName || 'This user'} has been removed from the group.`,
        variant: 'success',
      });

      router.back();
    } catch {
      toast({
        title: 'Error removing member',
        description: 'Failed to remove the member from the group. Please try again.',
        variant: 'error',
      });
    }
  }

  return (
    <Button
      variant="destructive"
      icon={Trash2}
      size="icon"
      onPress={() => {
        showConfirmAlert(
          'Remove Member',
          `Are you sure you want to remove ${memberName || 'this user'} from the group?`,
          onConfirm
        );
      }}
      loading={isRemovingMember}
    />
  );
}
