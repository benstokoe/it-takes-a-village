import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { CreateGroupForm } from '@/components/groups/create-group-form';
import { GroupsList } from '@/components/groups/groups-list';
import { JoinGroupForm } from '@/components/groups/join-group-form';
import { useSheetRef } from '@/components/sheet';
import { BottomSheet, View } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useGroups } from '@/hooks/group/useGroups';
import { useState } from 'react';

export default function Groups() {
  const { groups, isLoading } = useGroups();
  const [isJoinGroupVisible, setIsJoinGroupVisible] = useState(false);
  const [isCreateGroupVisible, setIsCreateGroupVisible] = useState(false);

  const joinGroupBottomSheetRef = useSheetRef();
  const createGroupBottomSheetRef = useSheetRef();

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
        <Button variant="outline" onPress={() => joinGroupBottomSheetRef.current?.present()}>
          Join A Group
        </Button>

        <BottomSheet ref={joinGroupBottomSheetRef} title="Join A Group">
          <JoinGroupForm onGroupJoined={async (inviteCode) => {}} isLoading={false} />
        </BottomSheet>

        <Button variant="outline" onPress={() => createGroupBottomSheetRef.current?.present()}>
          Create A Group
        </Button>

        <BottomSheet ref={createGroupBottomSheetRef} title="Create A Group">
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
