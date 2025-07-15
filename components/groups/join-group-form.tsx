import { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { View } from '../ui';
import { spacing } from '@/theme/globals';

type JoinGroupFormProps = {
  onGroupJoined: (inviteCode: string) => Promise<void>;
  isLoading?: boolean;
};

export function JoinGroupForm({ onGroupJoined, isLoading = false }: JoinGroupFormProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Validation Error', 'Invite code is required');
      return;
    }

    if (inviteCode.trim().length < 2) {
      Alert.alert('Validation Error', 'Invite code must be at least 2 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      await onGroupJoined(inviteCode.trim());
      setInviteCode('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isLoading || isSubmitting || !inviteCode.trim();

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: spacing(4) }}>
      <Input
        placeholder="Invite Code"
        value={inviteCode}
        onChangeText={setInviteCode}
        className="mb-3"
        editable={!isSubmitting && !isLoading}
        maxLength={50}
      />

      <Button onPress={handleSubmit} disabled={disabled} loading={isSubmitting || isLoading}>
        {isSubmitting || isLoading ? 'Joining...' : 'Join Group'}
      </Button>
    </View>
  );
}
