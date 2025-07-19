import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/text';
import { Avatar } from '@/components/avatar';
import { UserGroup } from '@/hooks/group/types';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Image } from 'expo-image';

type GroupCardProps = {
  group: UserGroup;
  onPress: (group: UserGroup) => void;
};

export default function GroupCard({ group, onPress }: GroupCardProps) {
  return (
    <TouchableOpacity
      className="gap-5"
      key={group.id}
      onPress={() => onPress(group)}
      activeOpacity={0.8}>
      <View className="flex-row items-center gap-4">
        <Image
          source={{ uri: group.cover_image_url }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
          }}
          contentFit="cover"
        />

        <View className="flex-col gap-1">
          <Text weight="medium" className="truncate">
            {group.name}
          </Text>
          <Text variant="caption" fontSize="small">
            {group.group_members.length} member{group.group_members.length > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-1 mt-1">
        {group.group_members.map((member, index) => (
          <Avatar
            size={36}
            key={member.id}
            className="border-[3px] border-background"
            style={{ marginLeft: index === 0 ? 0 : -10 }}>
            <AvatarImage source={{ uri: member.profiles.avatar_url ?? '' }} />
            <AvatarFallback>{member.profiles.full_name?.split(' ')[0].split('')[0]}</AvatarFallback>
          </Avatar>
        ))}
      </View>
    </TouchableOpacity>
  );
}
