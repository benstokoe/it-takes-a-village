import { Stack } from 'expo-router';
import { View, Alert } from 'react-native';

import { Container } from '@/components/Container';
import { Text } from '@/components/ui/text';
import { CreateGroupForm } from '@/components/CreateGroupForm';
import { GroupsList } from '@/components/GroupsList';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/utils/useAuth';
import { useGroups } from '@/utils/useGroups';

export default function Home() {
  const { session } = useAuth();
  const user = session?.user;
  const { groups, isLoading, error, createGroup } = useGroups();

  const handleCreateGroup = async (name: string, description?: string) => {
    const newGroup = await createGroup(name, description);
    if (newGroup) {
      Alert.alert(
        'Success',
        `${name} has been created! Share the invite code ${newGroup.invite_code} with your group members.`
      );
    }
  };

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: 'Home' }} />
        <Container>
          <Text className="text-red-600">Error loading groups: {error}</Text>
        </Container>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="flex-1 text-2xl font-bold">
            Welcome back
            {user?.user_metadata?.full_name
              ? `, ${user.user_metadata.full_name.split(' ')[0]}`
              : ''}
            !
          </Text>
          <ThemeToggle />
        </View>

        {groups.length === 0 && !isLoading ? (
          <View className="mt-6">
            <Text className="mb-6 text-gray-600 dark:text-gray-300">
              You&rsquo;re not part of any villages yet. Create your first village to start
              coordinating with family and friends!
            </Text>
            <CreateGroupForm onGroupCreated={handleCreateGroup} isLoading={isLoading} />
          </View>
        ) : (
          <View>
            <Text className="mb-4 text-gray-600 dark:text-gray-300">
              Here&rsquo;s what&rsquo;s happening in your villages
            </Text>
            <GroupsList groups={groups} isLoading={isLoading} />
          </View>
        )}
      </Container>
    </>
  );
}
