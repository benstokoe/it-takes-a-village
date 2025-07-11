import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPACING } from '@/theme/globals';
import { Text } from '@/components/ui';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '@/utils/useAuth';

export default function WelcomeScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const { colors } = useTheme();

  async function loginWithBetsy() {
    try {
      await signIn({ email: 'pete.kassulke82520@fox-min.com', password: 'testuser' });
    } catch (error: Error | any) {
      console.error(error.message);
    }
  }

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      padding: SPACING[4],
      backgroundColor: colors.background,
    },
    header: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: SPACING[4],
    },
    heading: {
      textAlign: 'center',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING[4],
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text variant="heading" style={styles.heading}>
          Welcome to It Takes A Village
        </Text>
        <Text variant="body" style={styles.heading}>
          Easily book and manage your availability with your friends and family.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
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
      </View>
    </SafeAreaView>
  );
}
