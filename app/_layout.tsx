import '@/global.css';

import { NAV_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';
import { AuthProvider } from '@/utils/useAuth';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
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
    <AuthProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />

        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="(protected)" />
          <Stack.Screen name="welcome" />
          <Stack.Screen
            name="sign-up"
            options={{
              presentation: 'modal',
              headerStyle: {
                backgroundColor:
                  colorScheme === 'dark' ? NAV_THEME.dark.background : NAV_THEME.light.background,
              },
              headerTintColor: colorScheme === 'dark' ? NAV_THEME.dark.text : NAV_THEME.light.text,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="sign-in"
            options={{
              presentation: 'modal',
              headerStyle: {
                backgroundColor:
                  colorScheme === 'dark' ? NAV_THEME.dark.background : NAV_THEME.light.background,
              },
              headerTintColor: colorScheme === 'dark' ? NAV_THEME.dark.text : NAV_THEME.light.text,
              gestureEnabled: true,
            }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
