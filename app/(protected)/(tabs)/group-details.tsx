import BackButton from '@/components/back-button';
import { Button } from '@/components/button';
import { Container } from '@/components/container';
import DeleteGroupButton from '@/components/groups/delete-group.button';
import InviteMember from '@/components/members/invite-member';
import MemberList from '@/components/members/member-list';
import { Text } from '@/components/text';
import { Spinner } from '@/components/ui';
import { useGroup } from '@/hooks/group/useGroup';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BORDER_RADIUS_FULL } from '@/theme/globals';
import { useAuth } from '@/utils/useAuth';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

export default function GroupDetails() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const { data: group, isLoading } = useGroup(groupId);
  const { session } = useAuth();
  const { isDarkColorScheme } = useColorScheme();

  const isCurrentUserAdmin = Boolean(
    group &&
      session?.user?.id &&
      (group.created_by === session.user.id ||
        group.group_members.some(
          (member) => member.user_id === session.user.id && member.role === 'admin'
        ))
  );

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
  console.log('Group data:', group);
  console.log('Cover image URL:', group.cover_image_url);

  return (
    <>
      <Container>
        <View className="flex-row justify-between items-center gap-2">
          <BackButton onBackPress={() => router.back()} />

          <Button
            variant="ghost"
            size="icon"
            icon={Plus}
            iconColor={isDarkColorScheme ? 'white' : 'black'}
            onPress={() => {
              router.push({
                pathname: '/(protected)/(tabs)/new-request',
                params: { groupId: group.id },
              });
            }}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-col gap-5">
            <View className="justify-center items-center gap-4">
              <Image
                source={{ uri: group.cover_image_url }}
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: BORDER_RADIUS_FULL,
                }}
                contentFit="cover"
              />

              <View className="gap-1">
                <Text variant="title" className="text-center">
                  {group.name}
                </Text>
                {group.description && (
                  <Text variant="caption" className="text-center">
                    {group.description}
                  </Text>
                )}
              </View>
            </View>

            <View className="gap-5">
              <View className="flex-row justify-between items-center gap-5">
                <Text variant="title">Members</Text>

                <InviteMember groupId={group.id} />
              </View>

              <MemberList
                members={group.group_members}
                groupId={groupId}
                userId={session?.user?.id}
                showRemoveButton={isCurrentUserAdmin}
              />
            </View>

            <View className="gap-5">
              <Text variant="title">Recent Activity</Text>

              <Text variant="body">No recent activity</Text>
            </View>

            <View className="flex-row justify-end gap-2">
              <Button variant="secondary">Edit</Button>
              <DeleteGroupButton groupId={group.id} />
            </View>
          </View>
        </ScrollView>

        <View className="gap-2 flex-row"></View>
      </Container>
    </>
  );
}
