import { Card } from '@/components/card';
import { Container } from '@/components/container';
import { GroupsList } from '@/components/groups-list';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/text';
import { useGroup } from '@/hooks/group/useGroup';
import { useGroups, UserGroup } from '@/hooks/group/useGroups';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

export default function NewRequest() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const [selectedGroup, setSelectedGroup] = useState<string>(groupId);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedGroup('');
      };
    }, [])
  );

  const { data, isLoading } = useGroup(selectedGroup);

  const { groups } = useGroups();

  function handleGroupPress(group: UserGroup) {
    setSelectedGroup(group.id);
  }

  if (!selectedGroup) {
    return (
      <SafeAreaView className="p-4 flex-col gap-4">
        <Text variant="heading">New Request</Text>

        <Text variant="body">Please select a group</Text>

        <GroupsList groups={groups} isLoading={isLoading} onGroupPress={handleGroupPress} />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text variant="title">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Container>
        <Text variant="title">New Request</Text>

        <Card>
          <Text variant="body">{data?.[0].name}</Text>
        </Card>
      </Container>
    </>
  );
}
