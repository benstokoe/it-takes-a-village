import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/supabase/database.types';

type Group = Database['public']['Tables']['groups']['Row'];

export default async function updateGroupCover(
  client: SupabaseClient<Database>,
  groupId: string,
  coverImageUrl: string
): Promise<Group> {
  const { data, error } = await client
    .from('groups')
    .update({ cover_image_url: coverImageUrl })
    .eq('id', groupId)
    .select()
    .single();

  if (error) {
    console.error('Error updating group cover:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No group data returned after update');
  }

  return data;
}
