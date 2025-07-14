import { Group, GroupMember, Profile } from '@/utils/supabase';

export type UserGroup = Group & {
  group_members: (GroupMember & {
    profiles: Profile;
  })[];
};
