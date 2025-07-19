import { supabase } from '@/utils/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

export interface MediaAsset {
  id: string;
  uri: string;
  type: 'image';
}

export async function uploadImageToSupabase(image: MediaAsset, groupName: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' });

    const fileExtension = image.uri.split('.').pop() || 'jpg';
    const fileName = `group-${groupName}.${fileExtension}`;
    const filePath = `covers/${fileName}`;

    const { data, error } = await supabase.storage
      .from('group-images')
      .upload(filePath, decode(base64), {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    if (!data?.path) {
      throw new Error('Upload succeeded but no file path returned');
    }

    // TODO: what happens after a year?
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('group-images')
      .createSignedUrl(data.path, 60 * 60 * 24 * 365);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      const { data: publicUrlData } = supabase.storage.from('group-images').getPublicUrl(data.path);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get both signed and public URL for uploaded image');
      }

      return publicUrlData.publicUrl;
    }

    return signedUrlData.signedUrl;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred during image upload');
  }
}
