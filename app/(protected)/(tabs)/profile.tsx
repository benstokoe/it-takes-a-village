import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/utils/useAuth';
import { View } from 'react-native';

export default function Profile() {
  const { session, signOut } = useAuth();
  const user = session?.user;

  return (
    <Container>
      <View className="gap-6">
        <View className="gap-2">
          <Text variant="heading">Profile</Text>
          <Text className="text-muted-foreground">
            Manage your account settings and preferences
          </Text>
        </View>

        {user && (
          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium text-muted-foreground">Name</Text>
              <Text className="text-lg">{user.user_metadata?.full_name || 'Not set'}</Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-muted-foreground">Email</Text>
              <Text className="text-lg">{user.email}</Text>
            </View>
          </View>
        )}

        <View className="border-t border-border pt-6">
          <Text className="mb-4 text-lg font-semibold">Appearance</Text>
          <ModeToggle />
        </View>

        <View className="border-t border-border pt-6">
          <Button variant="destructive" onPress={signOut}>
            <Text>Sign Out</Text>
          </Button>
        </View>
      </View>
    </Container>
  );
}
