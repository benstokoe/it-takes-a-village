import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { Text } from '@/components/text';
import { BORDER_RADIUS_FULL } from '@/theme/globals';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Container className="gap-10">
      <Image
        source={{ uri: 'welcome' }}
        style={{ width: '100%', height: 320, borderRadius: BORDER_RADIUS_FULL }}
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
      </View>
    </Container>
  );
}
