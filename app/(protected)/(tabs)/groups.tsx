import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { GroupsList } from '@/components/groups/groups-list';
import { Icon, View } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useGroups } from '@/hooks/group/useGroups';
import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ScrollView } from 'react-native';

export default function Groups() {
  const { groups, isLoading } = useGroups();

  if (isLoading) {
    return (
      <Container>
        <Text variant="heading">Loading...</Text>
      </Container>
    );
  }

  return (
    <Container className="gap-4">
      <View className="flex-row justify-between items-center">
        <Text variant="title">My Groups</Text>

        <Link href="/(protected)/(tabs)/create-group" asChild>
          <Button variant="ghost" size="icon">
            <Icon name={Plus} />
          </Button>
        </Link>
      </View>

      <ScrollView>
        <View className="pb-4">
          {groups.length > 0 ? (
            <GroupsList groups={groups} isLoading={isLoading} />
          ) : (
            <Text variant="body">No groups found</Text>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
