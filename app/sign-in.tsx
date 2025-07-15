import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { useAuth } from '@/utils/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

const formSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Please enter at least 8 characters.')
    .max(64, 'Please enter fewer than 64 characters.'),
});

export default function SignIn() {
  const { signIn } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signIn({ email: data.email, password: data.password });

      form.reset();
    } catch (error: Error | any) {
      console.error(error.message);
    }
  }

  async function loginWithPete() {
    try {
      await signIn({ email: 'pete.kassulke82520@fox-min.com', password: 'testuser' });

      form.reset();
    } catch (error: Error | any) {
      console.error(error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4" edges={['top', 'bottom']}>
      <View className="web:m-4 flex-1 gap-4">
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput
                  label="Email"
                  placeholder="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label="Password"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  {...field}
                />
              )}
            />
          </View>
        </Form>
      </View>

      <View className="flex flex-col gap-4">
        <Button
          size="default"
          variant="default"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          className="web:m-4">
          {form.formState.isSubmitting ? <ActivityIndicator size="small" /> : 'Sign In'}
        </Button>

        <Button
          size="default"
          variant="default"
          onPress={loginWithPete}
          disabled={form.formState.isSubmitting}
          className="web:m-4">
          Login with Pete
        </Button>
      </View>
    </SafeAreaView>
  );
}
