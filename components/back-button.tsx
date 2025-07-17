import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { Icon } from './ui';
import { useColorScheme } from '@/hooks/useColorScheme';

type BackButtonProps = {
  onBackPress: () => void;
};

export default function BackButton({ onBackPress }: BackButtonProps) {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <TouchableOpacity className="flex-row items-center" onPress={onBackPress} activeOpacity={0.7}>
      <Icon
        name={ArrowLeft}
        size={20}
        strokeWidth={3}
        color={isDarkColorScheme ? 'white' : 'black'}
      />
    </TouchableOpacity>
  );
}
