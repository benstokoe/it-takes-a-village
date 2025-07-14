import { Stack } from 'expo-router';
import { Alert, View } from 'react-native';

import { CreateGroupForm } from '@/components/CreateGroupForm';
import { GroupsList } from '@/components/GroupsList';
import { Avatar, AvatarFallback, AvatarImage, Card } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useGroups } from '@/hooks/useGroups';
import { useAuth } from '@/utils/useAuth';
import { Container } from '@/components/container';

export default function Home() {
  const { profile } = useAuth();
  const { groups, isLoading, error, createGroup } = useGroups();

  const handleCreateGroup = async (name: string, description?: string) => {
    const newGroup = await createGroup(name, description);

    if (newGroup) {
      Alert.alert('Success', `${name} has been created!`);
    }
  };

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: 'Home' }} />
        <Container>
          <Text className="text-red-500">Error loading groups: {error}</Text>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container>
        <View className="flex-row items-center gap-2 mb-4">
          <Avatar>
            <AvatarImage source={{ uri: profile?.avatar_url ?? '' }} />
            <AvatarFallback>{profile?.full_name?.split(' ')[0].split('')[0]}</AvatarFallback>
          </Avatar>

          <Text variant="title">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
          </Text>
        </View>

        <View className="flex-col gap-4">
          <Text variant="title">Upcoming Events</Text>
          <View className="flex-row gap-2">
            <Card>
              <Text>Event 1</Text>
            </Card>
          </View>
        </View>

        {groups.length === 0 && !isLoading ? (
          <View className="mt-4">
            <Text>
              You&rsquo;re not part of any villages yet. Create your first village to start
              coordinating with family and friends!
            </Text>
            <CreateGroupForm onGroupCreated={handleCreateGroup} isLoading={isLoading} />
          </View>
        ) : (
          <View className="flex-col gap-4">
            <Text>Here&rsquo;s what&rsquo;s happening in your villages</Text>
            <GroupsList groups={groups} isLoading={isLoading} />
          </View>
        )}
      </Container>
    </>
  );
}
