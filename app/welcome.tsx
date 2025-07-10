import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H1, Muted } from '@/components/ui/typography';
import { SafeAreaView } from '@/components/safe-area-view';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex flex-1 bg-background p-4">
      <View className="flex flex-1 items-center justify-center gap-y-4 web:m-4">
        <H1 className="text-center">Welcome to It Takes A Village</H1>
        <Muted className="text-center">
          Easily book and manage your availability with your friends and family.
        </Muted>
      </View>
      <View className="flex flex-col gap-y-4 web:m-4">
        <Button
          size="default"
          variant="default"
          onPress={() => {
            router.push('/sign-up');
          }}>
          <Text>Sign Up</Text>
        </Button>
        <Button
          size="default"
          variant="secondary"
          onPress={() => {
            router.push('/sign-in');
          }}>
          <Text>Sign In</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
