import { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type CreateGroupFormProps = {
  onGroupCreated: (name: string, description?: string) => Promise<void>;
  isLoading?: boolean;
};

export function CreateGroupForm({ onGroupCreated, isLoading = false }: CreateGroupFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Group name is required');
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert('Validation Error', 'Group name must be at least 2 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      await onGroupCreated(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isLoading || isSubmitting || !name.trim();

  return (
    <>
      <Text className="mb-4 text-lg font-semibold">Create Your First Village</Text>

      <Input
        placeholder="Group name (e.g., The Johnson Family)"
        value={name}
        onChangeText={setName}
        className="mb-3"
        editable={!isSubmitting && !isLoading}
        maxLength={50}
      />

      <Input
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        className="mb-4"
        multiline
        numberOfLines={3}
        editable={!isSubmitting && !isLoading}
        maxLength={200}
      />

      <Button onPress={handleSubmit} disabled={disabled}>
        {isSubmitting || isLoading ? (
          <>
            <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
            <Text>Creating...</Text>
          </>
        ) : (
          <Text>Create Village</Text>
        )}
      </Button>
    </>
  );
}
