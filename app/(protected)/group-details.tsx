import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage, Button, Spinner } from '@/components/ui';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPACING } from '@/theme/globals';
import { useTheme } from '@react-navigation/native';
import { useGroups, UserGroup } from '@/hooks/useGroups';
import { useEffect, useState } from 'react';
import { Users, Calendar, Settings, ArrowLeft, Trash2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useAuth } from '@/utils/useAuth';

export default function GroupDetails() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const { groups, removeMemberFromGroup } = useGroups();
  const { colors } = useTheme();
  const { session } = useAuth();
  const [group, setGroup] = useState<UserGroup | null>(null);

  useEffect(() => {
    if (groupId && groups.length > 0) {
      const foundGroup = groups.find((g) => g.id === groupId);
      setGroup(foundGroup || null);
    }
  }, [groupId, groups]);

  const isCurrentUserAdmin =
    group &&
    session?.user?.id &&
    (group.created_by === session.user.id ||
      group.group_members.some(
        (member) => member.user_id === session.user.id && member.role === 'admin'
      ));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: SPACING[4],
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING[4],
      paddingVertical: SPACING[2],
      alignSelf: 'flex-start',
    },
    headerContainer: {
      marginBottom: SPACING[6],
    },
    header: {
      marginBottom: SPACING[6],
    },
    section: {
      marginBottom: SPACING[6],
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING[3],
      gap: SPACING[2],
    },
    memberGrid: {
      gap: SPACING[2],
    },
    memberCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 12,
      padding: SPACING[3],
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING[3],
      minWidth: '45%',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    memberInfo: {
      flex: 1,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: SPACING[3],
      marginTop: SPACING[4],
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 12,
      padding: SPACING[4],
      marginBottom: SPACING[4],
    },
    statItem: {
      alignItems: 'center',
      gap: SPACING[1],
    },
  });

  if (!group) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.content}>
            <Spinner />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}>
              <Icon name={ArrowLeft} size={20} color={colors.text} />
              <Text variant="body" style={{ marginLeft: SPACING[2] }}>
                Back
              </Text>
            </TouchableOpacity>

            <Text variant="heading" style={{ marginBottom: SPACING[2] }}>
              {group.name}
            </Text>
            {group.description && (
              <Text variant="body" style={{ opacity: 0.8 }}>
                {group.description}
              </Text>
            )}
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Icon name={Users} size={24} color={colors.text} />
              <Text variant="caption">{group.group_members.length}</Text>
              <Text variant="caption" style={{ opacity: 0.6 }}>
                Members
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name={Calendar} size={24} color={colors.text} />
              <Text variant="caption">0</Text>
              <Text variant="caption" style={{ opacity: 0.6 }}>
                Requests
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name={Settings} size={24} color={colors.text} />
              <Text variant="caption">
                {group.created_by === group.group_members[0]?.user_id ? 'Admin' : 'Member'}
              </Text>
              <Text variant="caption" style={{ opacity: 0.6 }}>
                Role
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name={Users} size={20} color={colors.text} />
              <Text variant="subtitle">Members ({group.group_members.length})</Text>
            </View>

            <View style={styles.memberGrid}>
              {group.group_members.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <Avatar>
                    <AvatarImage source={{ uri: member.profiles.avatar_url ?? '' }} />
                    <AvatarFallback>
                      {member.profiles.full_name?.split(' ')[0]?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <View style={styles.memberInfo}>
                    <Text variant="body" numberOfLines={1}>
                      {member.profiles.full_name || 'Unknown User'}
                    </Text>
                    <Text variant="caption" style={{ opacity: 0.6 }}>
                      {member.relationship_label || member.role}
                    </Text>
                  </View>
                  {isCurrentUserAdmin && member.user_id !== session?.user?.id && (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Remove Member',
                          `Are you sure you want to remove ${member.profiles.full_name || 'this user'} from the group?`,
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Remove',
                              style: 'destructive',
                              onPress: async () => {
                                const success = await removeMemberFromGroup(member.id, groupId);
                                if (success) {
                                  Alert.alert(
                                    'Member removed',
                                    `${member.profiles.full_name || 'This user'} has been removed from the group.`
                                  );
                                  router.back(); // Go back to refresh the list
                                } else {
                                  Alert.alert(
                                    'Error removing member',
                                    'Failed to remove the member from the group. Please try again.'
                                  );
                                }
                              },
                            },
                          ]
                        );
                      }}
                      style={{ padding: SPACING[1] }}>
                      <Icon name={Trash2} size={18} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name={Calendar} size={20} color={colors.text} />
              <Text variant="subtitle">Recent Activity</Text>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                padding: SPACING[4],
                alignItems: 'center',
              }}>
              <Text variant="body" style={{ opacity: 0.6 }}>
                No recent activity
              </Text>
              <Text variant="caption" style={{ opacity: 0.4, marginTop: SPACING[1] }}>
                Group activity will appear here
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              variant="outline"
              onPress={() => {
                // TODO: Implement invite functionality
                console.log('Invite member to group');
              }}>
              Invite Member
            </Button>
            <Button
              variant="default"
              onPress={() => {
                // TODO: Implement create request functionality
                console.log('Create availability request');
              }}>
              Create Request
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
