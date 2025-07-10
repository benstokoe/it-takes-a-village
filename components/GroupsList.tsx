import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Group, GroupMember } from '@/database.types';

type UserGroup = Group & {
  group_members: GroupMember;
};

type GroupsListProps = {
  groups: UserGroup[];
  isLoading: boolean;
};

export function GroupsList({ groups, isLoading }: GroupsListProps) {
  if (isLoading) {
    return (
      <View className="py-8">
        <Text className="text-center text-gray-600">Loading your villages...</Text>
      </View>
    );
  }

  if (groups.length === 0) {
    return null;
  }

  return (
    <View className="mt-6">
      <Text className="mb-4 text-lg font-semibold">Your Villages</Text>

      <ScrollView className="space-y-3" showsVerticalScrollIndicator={false}>
        {groups.map((group) => (
          <View key={group.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">{group.name}</Text>
                {group.description && (
                  <Text className="mt-1 text-sm text-gray-600">{group.description}</Text>
                )}
                <Text className="mt-2 text-xs text-gray-500">
                  Role: {group.group_members.role === 'admin' ? 'Admin' : 'Member'}
                  {group.group_members.relationship_label &&
                    ` • ${group.group_members.relationship_label}`}
                </Text>
              </View>

              <View className="ml-3">
                <Text className="font-mono text-xs text-gray-500">{group.invite_code}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
