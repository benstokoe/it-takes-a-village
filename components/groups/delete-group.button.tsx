import useDeleteGroup from '@/hooks/group/useDeleteGroup';
import { useRouter } from 'expo-router';
import { Trash } from 'lucide-react-native';
import { Button } from '../button';
import { showConfirmAlert, useToast } from '../ui';

type DeleteGroupButtonProps = {
  groupId: string;
  onSuccess?: () => void;
};

export default function DeleteGroupButton({ groupId, onSuccess }: DeleteGroupButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { deleteGroup, isDeletingGroup } = useDeleteGroup();

  async function onConfirm() {
    try {
      await deleteGroup(groupId);

      onSuccess?.();

      toast({
        title: 'Group deleted',
        description: `The group has been deleted.`,
        variant: 'success',
      });

      router.back();
    } catch {
      toast({
        title: 'Error deleting group',
        description: 'Failed to delete the group. Please try again.',
        variant: 'error',
      });
    }
  }

  return (
    <Button
      variant="secondary"
      className="flex-1 rounded-full w-auto"
      loading={isDeletingGroup}
      onPress={() =>
        showConfirmAlert('Delete Group', `Are you sure you want to delete this group?`, onConfirm)
      }>
      Delete
    </Button>
  );
}
