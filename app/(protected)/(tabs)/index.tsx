import { Stack } from 'expo-router';
import { View, Alert, StyleSheet } from 'react-native';

import { Container } from '@/components/Container';
import { Text } from '@/components/ui/text';
import { CreateGroupForm } from '@/components/CreateGroupForm';
import { GroupsList } from '@/components/GroupsList';
import { useAuth } from '@/utils/useAuth';
import { useGroups } from '@/hooks/useGroups';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui';
import { SPACING } from '@/theme/globals';
import { useTheme } from '@react-navigation/native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { profile } = useAuth();
  const { groups, isLoading, error, createGroup } = useGroups();
  const { colors } = useTheme();
  const red = useThemeColor({}, 'red');

  const handleCreateGroup = async (name: string, description?: string) => {
    const newGroup = await createGroup(name, description);

    if (newGroup) {
      Alert.alert('Success', `${name} has been created!`);
    }
  };

  const styles = StyleSheet.create({
    error: {
      color: red,
    },
    container: {
      flex: 1,
      padding: SPACING[4],
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING[4],
      gap: SPACING[2],
    },
  });

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: 'Home' }} />
        <Container>
          <Text style={styles.error}>Error loading groups: {error}</Text>
        </Container>
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={{ padding: SPACING[4] }}>
        <View style={styles.header}>
          <Avatar>
            <AvatarImage source={{ uri: profile?.avatar_url ?? '' }} />
            <AvatarFallback>{profile?.full_name?.split(' ')[0].split('')[0]}</AvatarFallback>
          </Avatar>

          <Text variant="title">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
          </Text>
        </View>

        {groups.length === 0 && !isLoading ? (
          <View style={{ marginTop: SPACING[4] }}>
            <Text>
              You&rsquo;re not part of any villages yet. Create your first village to start
              coordinating with family and friends!
            </Text>
            <CreateGroupForm onGroupCreated={handleCreateGroup} isLoading={isLoading} />
          </View>
        ) : (
          <View>
            <Text>Here&rsquo;s what&rsquo;s happening in your villages</Text>
            <GroupsList groups={groups} isLoading={isLoading} />
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
