import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Container } from '@/components/container';
import DeleteGroupButton from '@/components/groups/delete-group.button';
import InviteMember from '@/components/groups/invite-member';
import RemoveUser from '@/components/groups/remove-user';
import { Text } from '@/components/text';
import { Avatar, AvatarFallback, AvatarImage, Spinner } from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import { useGroup } from '@/hooks/group/useGroup';
import { useAuth } from '@/utils/useAuth';
import { useTheme } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Plus, UserPlus, Users } from 'lucide-react-native';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export default function GroupDetails() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const { data: group, isLoading } = useGroup(groupId);
  const { colors } = useTheme();
  const { session } = useAuth();

  const isCurrentUserAdmin =
    group &&
    session?.user?.id &&
    (group.created_by === session.user.id ||
      group.group_members.some(
        (member) => member.user_id === session.user.id && member.role === 'admin'
      ));

  if (isLoading) {
    return (
      <Container>
        <View className="flex-1 p-4">
          <Spinner />
        </View>
      </Container>
    );
  }

  if (!group) {
    return (
      <Container>
        <View className="flex-1 p-4">
          <Text>Group not found</Text>
        </View>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Icon name={ArrowLeft} size={20} color={colors.text} />
          <Text variant="body" className="ml-2">
            Back
          </Text>
        </TouchableOpacity>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="mb-6">
            <Text variant="heading" className="mb-2">
              {group.name}
            </Text>
            {group.description && (
              <Text variant="body" className="opacity-80">
                {group.description}
              </Text>
            )}
          </View>

          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <Icon name={Users} size={20} color={colors.text} />
              <Text variant="subtitle">Members ({group.group_members.length})</Text>
            </View>

            <View className="flex-col gap-2">
              {group.group_members.map((member) => (
                <Card
                  key={member.id}
                  className="w-full bg-background/5 rounded-lg p-3 flex-row items-center gap-3">
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
                    <RemoveUser
                      memberId={member.id}
                      memberName={member.profiles.full_name!}
                      groupId={groupId}
                    />
                  )}
                </Card>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <Icon name={UserPlus} size={20} color={colors.text} />
              <Text variant="subtitle">Requests (1)</Text>
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

          <DeleteGroupButton groupId={group.id} />
        </ScrollView>

        <View className="gap-2 flex-row">
          <InviteMember groupId={group.id} />

          <Button
            variant="default"
            className="flex-1"
            icon={Plus}
            onPress={() => {
              router.push({
                pathname: '/(protected)/(tabs)/new-request',
                params: { groupId: group.id },
              });
            }}>
            Create Request
          </Button>
        </View>
      </Container>
    </>
  );
}
