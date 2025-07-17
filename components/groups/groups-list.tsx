import { Text } from '@/components/text';
import { UserGroup } from '@/hooks/group/types';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import GroupCard from './group-card';
import { CreateGroupForm } from './create-group-form';

type GroupsListProps = {
  groups: UserGroup[];
  isLoading: boolean;
  onGroupPress?: (group: UserGroup) => void;
};

export function GroupsList({ groups, isLoading, onGroupPress }: GroupsListProps) {
  const router = useRouter();

  function handleGroupPress(group: UserGroup) {
    router.push({
      pathname: '/(protected)/(tabs)/group-details',
      params: {
        groupId: group.id,
      },
    });
  }

  if (isLoading) {
    return (
      <View className="py-8">
        <Text className="text-center text-gray-600">Loading your groups...</Text>
      </View>
    );
  }

  if (groups.length === 0) {
    return (
      <View className="mt-4">
        <Text>
          You&rsquo;re not part of any villages yet. Create your first village to start coordinating
          with family and friends!
        </Text>

        <CreateGroupForm />
      </View>
    );
  }

  return (
    <View className="flex-col gap-5">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          onPress={() => (onGroupPress ? onGroupPress(group) : handleGroupPress(group))}
        />
      ))}
    </View>
  );
}
