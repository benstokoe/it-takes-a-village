import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/utils/useAuth';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/theme/theme-provider';

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                    <Text
                      style={{
                        fontSize: 18,
                      }}>
                      ✕
                    </Text>
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
                    <Text
                      style={{
                        fontSize: 18,
                        // color: colorScheme === 'dark' ? NAV_THEME.dark.text : NAV_THEME.light.text,
                      }}>
                      ✕
                    </Text>
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
    </GestureHandlerRootView>
  );
}
