// hooks/useUsers.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';

export function useGroup(groupId: string) {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      if (!groupId) return null;

      const { data, error } = await supabase.from('groups').select('*').eq('id', groupId);

      if (error) throw error;
      return data;
    },
  });
}
