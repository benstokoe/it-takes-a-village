import { Text } from '@/components/text';
import { UserGroup } from '@/hooks/group/types';
import { useRouter } from 'expo-router';
import { Dimensions, View } from 'react-native';
import GroupCard from './group-card';
import { FlashList } from '@shopify/flash-list';

type GroupsListProps = {
  groups: UserGroup[];
  isLoading: boolean;
  onGroupPress?: (group: UserGroup) => void;
};

export function GroupsList({ groups, isLoading, onGroupPress }: GroupsListProps) {
  const router = useRouter();

  function handleGroupPress(group: UserGroup) {
    router.push({
      pathname: '/(protected)/group-details',
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
    return null;
  }

  return (
    <View className="flex-col gap-4">
      <Text variant="title">Your Groups</Text>

      <View className="flex-col gap-4">
        <View style={{ flex: 1, minHeight: 200 }}>
          <FlashList
            data={groups}
            renderItem={({ item }) => (
              <GroupCard
                group={item}
                onPress={() => (onGroupPress ? onGroupPress(item) : handleGroupPress(item))}
              />
            )}
            estimatedItemSize={groups.length}
          />
        </View>

        {/* {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onPress={() => (onGroupPress ? onGroupPress(group) : handleGroupPress(group))}
          />
        ))} */}
      </View>
    </View>
  );
}
