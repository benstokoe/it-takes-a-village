import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/lib/constants';

export default function TabLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text + '80', // Add opacity
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="person-circle-plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
