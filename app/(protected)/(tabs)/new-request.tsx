import { Card } from '@/components/card';
import { Container } from '@/components/container';
import { GroupsList } from '@/components/groups/groups-list';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/text';
import { useGroup } from '@/hooks/group/useGroup';
import { useGroups } from '@/hooks/group/useGroups';
import { UserGroup } from '@/hooks/group/types';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button } from '@/components/button';
import BackButton from '@/components/back-button';

function Heading() {
  return <Text variant="heading">New Request</Text>;
}

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
      <Container>
        <Heading />

        <Text variant="body">Please select a group</Text>

        <GroupsList groups={groups} isLoading={isLoading} onGroupPress={handleGroupPress} />
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Text variant="title">Loading...</Text>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Heading />

        <BackButton onBackPress={() => setSelectedGroup('')} />

        <Text variant="body">{data?.name}</Text>
      </Container>
    </>
  );
}
