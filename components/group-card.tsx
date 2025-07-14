import { UserGroup } from '@/hooks/useGroups';
import { TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/card';
import { Text } from '@/components/text';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type GroupCardProps = {
  group: UserGroup;
  onPress: (group: UserGroup) => void;
};

export default function GroupCard({ group, onPress }: GroupCardProps) {
  return (
    <TouchableOpacity key={group.id} onPress={() => onPress(group)} activeOpacity={0.8}>
      <Card className="flex-col gap-1">
        <Text variant="subtitle">{group.name}</Text>
        {group.description && <Text>{group.description}</Text>}

        <View className="flex-row gap-1 mt-1">
          {group.group_members.map((member) => (
            <Avatar key={member.id}>
              <AvatarImage source={{ uri: member.profiles.avatar_url ?? '' }} />
              <AvatarFallback>
                {member.profiles.full_name?.split(' ')[0].split('')[0]}
              </AvatarFallback>
            </Avatar>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
}
