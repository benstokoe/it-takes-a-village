import { SafeAreaView } from '@/components/safe-area-view';
import { Avatar, AvatarFallback, AvatarImage, Spinner, useToast } from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/text';
import { useGroups, UserGroup } from '@/hooks/useGroups';
import { useAuth } from '@/utils/useAuth';
import { useTheme } from '@react-navigation/native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Settings, Trash2, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

export default function GroupDetails() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const { groups, removeMemberFromGroup } = useGroups();
  const { colors } = useTheme();
  const { session } = useAuth();
  const [group, setGroup] = useState<UserGroup | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (groupId && groups.length > 0) {
      const foundGroup = groups.find((g) => g.id === groupId);
      setGroup(foundGroup || null);
    }
  }, [groupId, groups]);

  const isCurrentUserAdmin =
    group &&
    session?.user?.id &&
    (group.created_by === session.user.id ||
      group.group_members.some(
        (member) => member.user_id === session.user.id && member.role === 'admin'
      ));

  if (!group) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <SafeAreaView className="flex-1 bg-background p-4" edges={['top', 'bottom']}>
          <View className="flex-1 p-4">
            <Spinner />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="mb-6">
            <TouchableOpacity
              className="flex-row items-center gap-2 mb-4 py-2"
              onPress={() => router.back()}
              activeOpacity={0.7}>
              <Icon name={ArrowLeft} size={20} color={colors.text} />
              <Text variant="body" className="ml-2">
                Back
              </Text>
            </TouchableOpacity>

            <Text variant="heading" className="mb-2">
              {group.name}
            </Text>
            {group.description && (
              <Text variant="body" className="opacity-80">
                {group.description}
              </Text>
            )}
          </View>

          <View className="flex-row justify-between bg-background/5 rounded-lg p-4 mb-4">
            <View className="items-center gap-1">
              <Icon name={Users} size={24} color={colors.text} />
              <Text>{group.group_members.length}</Text>
              <Text>Members</Text>
            </View>
            <View className="items-center gap-1">
              <Icon name={Calendar} size={24} color={colors.text} />
              <Text>0</Text>
              <Text>Requests</Text>
            </View>
            <View className="items-center gap-1">
              <Icon name={Settings} size={24} color={colors.text} />
              <Text>
                {group.created_by === group.group_members[0]?.user_id ? 'Admin' : 'Member'}
              </Text>
              <Text>Role</Text>
            </View>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <Icon name={Users} size={20} color={colors.text} />
              <Text variant="subtitle">Members ({group.group_members.length})</Text>
            </View>

            <View className="flex-col gap-2">
              {group.group_members.map((member) => (
                <View
                  key={member.id}
                  className="w-full bg-background/5 rounded-lg p-3 flex-row items-center gap-3 border">
                  <Avatar>
                    <AvatarImage source={{ uri: member.profiles.avatar_url ?? '' }} />
                    <AvatarFallback>
                      {member.profiles.full_name?.split(' ')[0]?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <View className="flex-1">
                    <Text numberOfLines={1}>{member.profiles.full_name || 'Unknown User'}</Text>
                    <Text variant="caption">{member.relationship_label || member.role}</Text>
                  </View>
                  {isCurrentUserAdmin && member.user_id !== session?.user?.id && (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Remove Member',
                          `Are you sure you want to remove ${member.profiles.full_name || 'this user'} from the group?`,
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Remove',
                              style: 'destructive',
                              onPress: async () => {
                                const success = await removeMemberFromGroup(member.id, groupId);

                                if (success) {
                                  toast({
                                    title: 'Member removed',
                                    description: `${member.profiles.full_name || 'This user'} has been removed from the group.`,
                                    variant: 'success',
                                  });
                                  router.back();
                                } else {
                                  toast({
                                    title: 'Error removing member',
                                    description:
                                      'Failed to remove the member from the group. Please try again.',
                                    variant: 'error',
                                  });
                                }
                              },
                            },
                          ]
                        );
                      }}
                      className="p-1"
                      activeOpacity={0.7}>
                      <Icon name={Trash2} size={18} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <Icon name={Calendar} size={20} color={colors.text} />
              <Text variant="subtitle">Recent Activity</Text>
            </View>
            <View className="bg-background/5 rounded-lg p-4 flex-col items-center">
              <Text variant="body" className="opacity-60">
                No recent activity
              </Text>
              <Text variant="caption" className="opacity-40 mt-1">
                Group activity will appear here
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <Button
              variant="outline"
              onPress={() => {
                // TODO: Implement invite functionality
                console.log('Invite member to group');
              }}>
              Invite Member
            </Button>
            <Button
              variant="default"
              onPress={() => {
                router.push({
                  pathname: '/(protected)/(tabs)/new-request',
                  params: { groupId: group.id },
                });
              }}>
              Create Request
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
