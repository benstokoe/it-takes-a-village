import { useColorScheme } from '@/lib/useColorScheme';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-sm">Theme:</Text>
      <Button variant="outline" size="sm" onPress={toggleColorScheme} className="min-w-20">
        <Text className="text-xs capitalize">
          {colorScheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </Text>
      </Button>
    </View>
  );
}
