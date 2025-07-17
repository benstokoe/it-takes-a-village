import { Icon } from '@/components/ui';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Calendar, Home, Plus, Users } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Icon size={24} name={Home} color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => <Icon size={24} name={Users} color={color} />,
        }}
      />
      <Tabs.Screen
        name="new-request"
        options={{
          title: 'New Request',
          tabBarIcon: ({ color }) => <Icon size={24} name={Plus} color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color }) => <Icon size={24} name={Calendar} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
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
