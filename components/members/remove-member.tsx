import useRemoveMember from '@/hooks/group/useRemoveMember';
import { Trash2 } from 'lucide-react-native';
import { Button } from '../button';
import { showConfirmAlert, useToast } from '../ui';
import { useColorScheme } from '@/hooks/useColorScheme';

type RemoveMemberProps = {
  memberId: string;
  memberName: string;
  groupId: string;
};

export default function RemoveMember({ memberId, memberName, groupId }: RemoveMemberProps) {
  const { toast } = useToast();
  const { removeMember, isRemovingMember } = useRemoveMember(groupId);
  const { isDarkColorScheme } = useColorScheme();

  async function onConfirm() {
    try {
      await removeMember({ memberId });

      toast({
        title: 'User removed',
        description: `${memberName || 'This user'} has been removed from the group.`,
        variant: 'success',
      });
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
      variant="ghost"
      icon={Trash2}
      iconColor={isDarkColorScheme ? 'white' : 'black'}
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
