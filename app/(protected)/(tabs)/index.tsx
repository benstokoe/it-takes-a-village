import { View } from 'react-native';

import { Container } from '@/components/container';
import { CreateGroupForm } from '@/components/groups/create-group-form';
import { GroupsList } from '@/components/groups/groups-list';
import { Avatar, AvatarFallback, AvatarImage, Card } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useGroups } from '@/hooks/group/useGroups';
import { useAuth } from '@/utils/useAuth';

export default function Home() {
  const { profile } = useAuth();
  const { groups, isLoading, error } = useGroups();

  if (error) {
    return (
      <>
        <Container>
          <Text className="text-red-500">Error loading groups: {error}</Text>
        </Container>
      </>
    );
  }

  return (
    <Container>
      <View className="flex-row items-center gap-2 mb-4">
        <Avatar>
          <AvatarImage source={{ uri: profile?.avatar_url ?? '' }} />
          <AvatarFallback>{profile?.full_name?.split(' ')[0].split('')[0]}</AvatarFallback>
        </Avatar>

        <View>
          <Text variant="title">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
          </Text>
          <Text variant="caption">Here&rsquo;s what&rsquo;s happening in your villages</Text>
        </View>
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
          <CreateGroupForm />
        </View>
      ) : (
        <GroupsList groups={groups} isLoading={isLoading} />
      )}
    </Container>
  );
}
