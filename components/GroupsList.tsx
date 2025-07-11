import { Text } from '@/components/ui/text';
import { SPACING } from '@/theme/globals';
import { UserGroup } from '@/utils/useGroups';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage, Carousel, CarouselItem } from './ui';

type GroupsListProps = {
  groups: UserGroup[];
  isLoading: boolean;
};

const { width: screenWidth } = Dimensions.get('window');

export function GroupsList({ groups, isLoading }: GroupsListProps) {
  const styles = StyleSheet.create({
    container: {
      marginTop: SPACING[6],
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING[4],
    },
    cardList: {},
  });

  if (isLoading) {
    return (
      <View className="py-8">
        <Text className="text-center text-gray-600">Loading your villages...</Text>
      </View>
    );
  }

  if (groups.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="subtitle">Your Villages</Text>

      <Carousel style={styles.cardList} itemWidth={screenWidth * 0.8} spacing={SPACING[4]}>
        {groups.map((group) => (
          <CarouselItem key={group.id}>
            <View style={{ display: 'flex', flexDirection: 'column', gap: SPACING[3] }}>
              <Text variant="subtitle">{group.name}</Text>
              {group.description && <Text>{group.description}</Text>}

              <View style={{ display: 'flex', flexDirection: 'row', gap: SPACING[3] }}>
                {group.group_members.map((member) => (
                  <Avatar key={member.id}>
                    <AvatarImage source={{ uri: member.profiles.avatar_url ?? '' }} />
                    <AvatarFallback>
                      {member.profiles.full_name?.split(' ')[0].split('')[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </View>
              {/* <Text className="mt-2 text-xs text-gray-500"> */}
              {/* Role: {group.group_members.role === 'admin' ? 'Admin' : 'Member'} */}
              {/* </Text> */}
            </View>
          </CarouselItem>
        ))}
      </Carousel>
    </View>
  );
}
