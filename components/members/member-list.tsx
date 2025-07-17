import { GroupMember } from '@/hooks/group/types';
import { Text } from '../text';
import { Avatar, AvatarFallback, AvatarImage, View } from '../ui';
import RemoveMember from './remove-member';

type MemberListProps = {
  members: GroupMember[];
  groupId: string;
  userId?: string;
  showRemoveButton?: boolean;
};

export default function MemberList({
  members,
  groupId,
  userId,
  showRemoveButton,
}: MemberListProps) {
  return (
    <View className="flex-col gap-4">
      {members.map((member) => (
        <View key={member.id} className="w-full flex-row items-center gap-4">
          <Avatar size={66}>
            <AvatarImage source={{ uri: member.profiles.avatar_url ?? '' }} />
            <AvatarFallback>{member.profiles.full_name?.split(' ')[0]?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <View className="flex-1">
            <Text numberOfLines={1} weight="medium">
              {member.profiles.full_name}
            </Text>
            <Text variant="caption" fontSize="small">
              {member.relationship_label || member.role}
            </Text>
          </View>
          {showRemoveButton && member.user_id !== userId && (
            <RemoveMember
              memberId={member.id}
              memberName={member.profiles.full_name!}
              groupId={groupId}
            />
          )}
        </View>
      ))}
    </View>
  );
}
