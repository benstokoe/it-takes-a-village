import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { Text } from '@/components/text';
import { useAuth } from '@/utils/useAuth';
import { BORDER_RADIUS } from '@/theme/globals';

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
    <Container className="gap-10">
      <Image
        source={{ uri: 'welcome' }}
        style={{ width: '100%', height: 320, borderRadius: BORDER_RADIUS }}
      />

      <View className="flex-1 items-center gap-4">
        <Text variant="heading" className="text-center text-5xl">
          Welcome to,
        </Text>
        <Text variant="heading" className="text-center text-5xl">
          It Takes A Village
        </Text>
        <Text variant="subtitle" weight="medium" className="text-center">
          Easily book and manage your availability with your friends and family.
        </Text>
      </View>

      <View className="flex-col gap-4">
        <Button
          variant="secondary"
          onPress={() => {
            router.push('/sign-up');
          }}>
          Sign Up
        </Button>
        <Button
          onPress={() => {
            router.push('/sign-in');
          }}>
          Sign In
        </Button>
        <Button variant="link" onPress={loginWithBetsy}>
          Login with Betsy
        </Button>
        <Button variant="link" onPress={loginWithElody}>
          Login with Elody
        </Button>
      </View>
    </Container>
  );
}
