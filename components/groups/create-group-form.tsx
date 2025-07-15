import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { spacing } from '@/theme/globals';
import { useState } from 'react';
import { useToast, View } from '@/components/ui';
import useCreateGroup from '@/hooks/group/useCreateGroup';

type CreateGroupFormProps = {
  onSuccess?: () => void;
};

export function CreateGroupForm({ onSuccess }: CreateGroupFormProps) {
  const { createGroup, isCreatingGroup } = useCreateGroup();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { toast } = useToast();

  async function handleCreateGroup(name: string, description?: string) {
    const newGroup = await createGroup({ name, description });

    if (newGroup) {
      toast({
        title: 'Success',
        description: `${name} has been created!`,
        variant: 'success',
      });

      onSuccess?.();
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Group name is required',
        variant: 'error',
      });
      return;
    }

    if (name.trim().length < 2) {
      toast({
        title: 'Validation Error',
        description: 'Group name must be at least 2 characters long',
        variant: 'error',
      });
      return;
    }

    try {
      await handleCreateGroup(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to create group. Please try again.',
        variant: 'error',
      });
    }
  };

  const disabled = isCreatingGroup || !name.trim();

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: spacing(4) }}>
      <Text variant="subtitle">Create Your First Village</Text>

      <Input
        placeholder="Group name (e.g., The Johnson Family)"
        value={name}
        onChangeText={setName}
        editable={!isCreatingGroup}
        maxLength={50}
        variant="outline"
      />

      <Input
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        type="textarea"
        rows={3}
        editable={!isCreatingGroup}
        maxLength={200}
        variant="outline"
      />

      <Button onPress={handleSubmit} disabled={disabled} loading={isCreatingGroup}>
        {isCreatingGroup ? 'Creating...' : 'Create Village'}
      </Button>
    </View>
  );
}
