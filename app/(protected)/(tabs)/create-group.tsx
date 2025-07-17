import BackButton from '@/components/back-button';
import { Container } from '@/components/container';
import { CreateGroupForm } from '@/components/groups/create-group-form';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';

export default function CreateGroup() {
  const router = useRouter();

  return (
    <Container>
      <BackButton onBackPress={() => router.back()} />

      <Text variant="title">Create Group</Text>

      <CreateGroupForm />
    </Container>
  );
}
