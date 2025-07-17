import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { spacing } from '@/theme/globals';
import { useState } from 'react';
import { useToast, View } from '@/components/ui';
import useCreateGroup from '@/hooks/group/useCreateGroup';
import { useRouter } from 'expo-router';
import { MediaPicker } from '../ui/media-picker';
import { ImageIcon } from 'lucide-react-native';

type CreateGroupFormProps = {
  onSuccess?: () => void;
};

export function CreateGroupForm({ onSuccess }: CreateGroupFormProps) {
  const { createGroup, isCreatingGroup } = useCreateGroup();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const { toast } = useToast();

  async function handleCreateGroup(name: string, description?: string) {
    const newGroup = await createGroup({ name, description });

    if (newGroup) {
      toast({
        title: 'Success',
        description: `${name} has been created!`,
        variant: 'success',
      });

      router.push({
        pathname: '/(protected)/(tabs)/group-details',
        params: {
          groupId: newGroup.id,
        },
      });
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
      <MediaPicker
        mediaType="image"
        showPreview={true}
        previewSize={100}
        buttonText="Add Media"
        icon={ImageIcon}
        // selectedAssets={assets}
        onSelectionChange={(newAssets) => {
          // setAssets(newAssets);
          console.log('Assets with preview:', newAssets);
        }}
      />

      <Input
        placeholder="Group name (e.g., The Johnson Family)"
        value={name}
        onChangeText={setName}
        editable={!isCreatingGroup}
        maxLength={50}
      />

      <Input
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        type="textarea"
        rows={3}
        editable={!isCreatingGroup}
        maxLength={200}
      />

      <Button onPress={handleSubmit} disabled={disabled} loading={isCreatingGroup}>
        Create Group
      </Button>
    </View>
  );
}
