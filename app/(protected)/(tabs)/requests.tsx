import { Stack } from 'expo-router';
import { View } from 'react-native';
import { Container } from '@/components/Container';
import { Text } from '@/components/ui/text';

export default function Requests() {
  return (
    <>
      <Stack.Screen options={{ title: 'Requests' }} />
      <Container>
        <View className="gap-6">
          <View>
            <Text className="mb-2 text-2xl font-bold">Requests</Text>
            <Text className="text-muted-foreground">
              View and manage availability requests from your village
            </Text>
          </View>

          <View className="items-center justify-center py-12">
            <Text className="text-lg text-muted-foreground">No requests yet</Text>
            <Text className="mt-2 text-sm text-muted-foreground">
              Requests from your village members will appear here
            </Text>
          </View>
        </View>
      </Container>
    </>
  );
}
