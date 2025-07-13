import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/utils/useAuth';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function ProtectedLayout() {
  const { initialized, session } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="group-details" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
