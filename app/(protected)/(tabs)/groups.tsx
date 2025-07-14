import { Text } from '@/components/ui/text';
import { Container } from '@/components/container';
import { useGroups } from '@/hooks/useGroups';
import { GroupsList } from '@/components/GroupsList';

export default function Groups() {
  const { groups, isLoading, error, createGroup } = useGroups();

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

      {groups.length > 0 ? (
        <GroupsList groups={groups} isLoading={isLoading} />
      ) : (
        <Text variant="body">No groups found</Text>
      )}
    </Container>
  );
}
