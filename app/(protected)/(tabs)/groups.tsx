import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { CreateGroupForm } from '@/components/create-group-form';
import { GroupsList } from '@/components/groups-list';
import { JoinGroupForm } from '@/components/join-group-form';
import { BottomSheet, View } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useGroups } from '@/hooks/group/useGroups';
import { useState } from 'react';

export default function Groups() {
  const { groups, isLoading } = useGroups();
  const [isJoinGroupVisible, setIsJoinGroupVisible] = useState(false);
  const [isCreateGroupVisible, setIsCreateGroupVisible] = useState(false);

  if (isLoading) {
    return (
      <Container>
        <Text variant="heading">Loading...</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Text variant="title">Groups</Text>

      <View className="flex flex-row gap-2">
        <Button variant="outline" onPress={() => setIsJoinGroupVisible(true)}>
          Join A Group
        </Button>

        <BottomSheet
          isVisible={isJoinGroupVisible}
          onClose={() => setIsJoinGroupVisible(false)}
          title="Join A Group"
          snapPoints={[0.3, 0.6, 0.9]}>
          <JoinGroupForm onGroupJoined={async (inviteCode) => {}} isLoading={false} />
        </BottomSheet>

        <Button variant="outline" onPress={() => setIsCreateGroupVisible(true)}>
          Create A Group
        </Button>

        <BottomSheet
          isVisible={isCreateGroupVisible}
          onClose={() => setIsCreateGroupVisible(false)}
          title="Create A Group"
          snapPoints={[0.6]}>
          <CreateGroupForm onSuccess={() => setIsCreateGroupVisible(false)} />
        </BottomSheet>
      </View>

      {groups.length > 0 ? (
        <GroupsList groups={groups} isLoading={isLoading} />
      ) : (
        <Text variant="body">No groups found</Text>
      )}
    </Container>
  );
}
