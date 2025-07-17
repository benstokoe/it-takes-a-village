import { NewRequestTabButton } from '@/components/new-request-tab-button';
import { Icon, View } from '@/components/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Tabs } from 'expo-router';
import { Calendar, Home, Plus, User, Users } from 'lucide-react-native';

export default function TabLayout() {
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'card');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: cardColor,
          borderTopWidth: 0,
          paddingTop: 12,
        },
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Icon size={24} name={Home} color={color} fill={focused ? color : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, focused }) => (
            <Icon size={24} name={Users} color={color} fill={focused ? color : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-request"
        options={{
          title: 'New Request',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                padding: 10,
                backgroundColor: focused ? primaryColor : color,
                borderRadius: 99,
              }}>
              <Icon size={24} name={Plus} color="white" fill={focused ? color : 'none'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, focused }) => (
            <Icon size={24} name={Calendar} color={color} fill={focused ? color : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Icon size={24} name={User} color={color} fill={focused ? color : 'none'} />
          ),
        }}
      />

      <Tabs.Screen
        name="group-details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="create-group"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
