import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/text';
import { Avatar } from '@/components/avatar';
import { UserGroup } from '@/hooks/group/types';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
        <View className="h-14 w-14 bg-primary rounded-full" />

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
