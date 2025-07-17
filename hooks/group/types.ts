import { Group, GroupMember as SupabaseGroupMember, Profile } from '@/utils/supabase';

export type GroupMember = SupabaseGroupMember & {
  profiles: Profile;
};

export type UserGroup = Group & {
  group_members: GroupMember[];
};
