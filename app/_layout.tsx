import '@/global.css';

import { Text } from '@/components/text';
import { ToastProvider } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider } from '@/theme/theme-provider';
import { AuthProvider } from '@/utils/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const colorScheme = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
              <Stack.Screen name="(protected)" />
              <Stack.Screen name="welcome" />
              <Stack.Screen
                name="sign-up"
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Sign Up',
                  headerLeft: () => null,
                  headerRight: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                      <Text className="text-2xl">✕</Text>
                    </TouchableOpacity>
                  ),
                  // headerStyle: {
                  //   backgroundColor:
                  //     colorScheme === 'dark' ? NAV_THEME.dark.background : NAV_THEME.light.background,
                  // },
                  // headerTintColor: colorScheme === 'dark' ? NAV_THEME.dark.text : NAV_THEME.light.text,
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="sign-in"
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Sign In',
                  headerLeft: () => null,
                  headerRight: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                      <Text className="text-2xl">✕</Text>
                    </TouchableOpacity>
                  ),
                  // headerStyle: {
                  //   backgroundColor:
                  //     colorScheme === 'dark' ? NAV_THEME.dark.background : NAV_THEME.light.background,
                  // },
                  // headerTintColor: colorScheme === 'dark' ? NAV_THEME.dark.text : NAV_THEME.light.text,
                  gestureEnabled: true,
                }}
              />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
