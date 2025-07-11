import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function Modal() {
  return (
    <View className="bg-background flex flex-1 items-center justify-center gap-y-4 p-4">
      <Text variant="heading" style={{ textAlign: 'center' }}>
        Modal
      </Text>
      <Text variant="body" style={{ textAlign: 'center' }}>
        This is a modal screen.
      </Text>
    </View>
  );
}
