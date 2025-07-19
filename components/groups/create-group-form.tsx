import { useToast, View } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput, FormMessage, FormTextarea } from '@/components/ui/form';
import { MediaAsset, MediaPicker } from '@/components/ui/media-picker';
import useCreateGroup from '@/hooks/group/useCreateGroup';
import { spacing } from '@/theme/globals';
import { uploadImageToSupabase } from '@/utils/supabase-upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ImageIcon } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

// Zod schema for form validation
const createGroupSchema = z.object({
  coverImage: z.array(z.custom<MediaAsset>()).max(1, 'Only one cover image is allowed'),
  name: z
    .string()
    .min(2, 'Group name must be at least 2 characters')
    .max(50, 'Group name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

type CreateGroupFormProps = {
  onSuccess?: () => void;
};

export function CreateGroupForm({ onSuccess }: CreateGroupFormProps) {
  const { createGroup, isCreatingGroup } = useCreateGroup();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      coverImage: [],
    },
    mode: 'onBlur',
  });

  const handleSubmit = async (data: CreateGroupFormData) => {
    try {
      const coverImageUrl = await uploadImageToSupabase(data.coverImage[0], data.name);

      const newGroup = await createGroup({
        name: data.name,
        description: data.description || undefined,
        coverImageUrl,
      });

      if (!newGroup || !newGroup.id) {
        throw new Error('Failed to create group or group ID is missing');
      }

      toast({
        title: 'Success',
        description: `${data.name} has been created!`,
      });

      form.reset();

      router.replace({
        pathname: '/(protected)/(tabs)/group-details',
        params: {
          groupId: newGroup.id.toString(),
        },
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group. Please try again.',
        variant: 'error',
      });
    }
  };

  const isLoading = isCreatingGroup || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <View style={{ display: 'flex', flexDirection: 'column', gap: spacing(4) }}>
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <>
              <Controller
                control={form.control}
                name="coverImage"
                render={({ field: { onChange, value } }) => (
                  <MediaPicker
                    mediaType="image"
                    showPreview
                    previewSize={128}
                    buttonText="Add group cover photo"
                    icon={ImageIcon}
                    selectedAssets={value || []}
                    maxSelection={1}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 16,
                    }}
                    onSelectionChange={onChange}
                    disabled={isLoading}
                  />
                )}
              />
              <FormMessage />
            </>
          )}
        />

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <>
              <FormInput
                {...field}
                placeholder="Group name (e.g., The Johnson Family)"
                editable={!isLoading}
                maxLength={50}
              />
              <FormMessage />
            </>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <>
              <FormTextarea
                {...field}
                placeholder="Description (optional)"
                value={field.value || ''}
                rows={3}
                editable={!isLoading}
                maxLength={200}
              />
              <FormMessage />
            </>
          )}
        />

        <Button onPress={form.handleSubmit(handleSubmit)} disabled={isLoading} loading={isLoading}>
          Create Group
        </Button>
      </View>
    </Form>
  );
}
