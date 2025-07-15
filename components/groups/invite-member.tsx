import { Form, FormField, FormInput } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react-native';
import { useEffect } from 'react';
import z from 'zod';
import { Button } from '../button';
import { useToast, View } from '../ui';

import { useInviteToGroup } from '@/hooks/group/useInviteToGroup';
import { useForm } from 'react-hook-form';
import { useSheetRef } from '../sheet';
import { BottomSheet } from '../ui/bottom-sheet';

type InviteMemberProps = {
  groupId: string;
};

const formSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  relationship: z.string().min(1, 'Please enter a relationship.'),
});

export default function InviteMember({ groupId }: InviteMemberProps) {
  const { toast } = useToast();
  const { inviteToGroup } = useInviteToGroup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      relationship: '',
    },
  });

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await inviteToGroup({ groupId, email: data.email, relationship: data.relationship });

      toast({
        title: 'Success',
        description: 'Member invited',
        variant: 'success',
      });

      bottomSheetRef.current?.close();

      form.reset();
    } catch (error: Error | any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'error',
      });
      console.error(error.message);
    }
  }

  const bottomSheetRef = useSheetRef();

  return (
    <>
      <Button variant="outline" icon={UserPlus} onPress={() => bottomSheetRef.current?.present()}>
        Invite Member
      </Button>

      <BottomSheet ref={bottomSheetRef}>
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput {...field} label="Email" autoCapitalize="none" autoComplete="email" />
              )}
            />
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Relationship"
                  autoCapitalize="words"
                  placeholder="Mum, Friend, Aunt"
                />
              )}
            />

            <Button
              size="default"
              variant="default"
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="web:m-4"
              loading={form.formState.isSubmitting}>
              Invite Member
            </Button>
          </View>
        </Form>
      </BottomSheet>

      {/* <BottomSheet
        isVisible={isVisible}
        onClose={() => {
          setIsVisible(false);
          form.reset();
        }}
        title="Invite Member"
        snapPoints={[0.45]}>
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput {...field} label="Email" autoCapitalize="none" autoComplete="email" />
              )}
            />
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Relationship"
                  autoCapitalize="words"
                  placeholder="Mum, Friend, Aunt"
                />
              )}
            />

            <Button
              size="default"
              variant="default"
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="web:m-4"
              loading={form.formState.isSubmitting}>
              Invite Member
            </Button>
          </View>
        </Form>
      </BottomSheet> */}
    </>
  );
}
