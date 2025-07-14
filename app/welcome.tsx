import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { useAuth } from '@/utils/useAuth';
import { SafeAreaView } from '@/components/safe-area-view';

export default function WelcomeScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  async function loginWithBetsy() {
    try {
      await signIn({ email: 'pete.kassulke82520@fox-min.com', password: 'testuser' });
    } catch (error: Error | any) {
      console.error(error.message);
    }
  }

  async function loginWithElody() {
    try {
      await signIn({ email: 'filiberto_walker71127@bleakcricket.org', password: 'testuser' });
    } catch (error: Error | any) {
      console.error(error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center items-center gap-4">
        <Text variant="heading" className="text-center">
          Welcome to It Takes A Village
        </Text>
        <Text variant="body" className="text-center">
          Easily book and manage your availability with your friends and family.
        </Text>
      </View>

      <View className="flex-col gap-4">
        <Button
          size="default"
          variant="default"
          onPress={() => {
            router.push('/sign-up');
          }}>
          Sign Up
        </Button>
        <Button
          size="default"
          variant="secondary"
          onPress={() => {
            router.push('/sign-in');
          }}>
          Sign In
        </Button>
        <Button size="default" variant="default" onPress={loginWithBetsy}>
          Login with Betsy
        </Button>
        <Button size="default" variant="default" onPress={loginWithElody}>
          Login with Elody
        </Button>
      </View>
    </SafeAreaView>
  );
}
