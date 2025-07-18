import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { Icon } from './ui';

type BackButtonProps = {
  onBackPress: () => void;
};

export default function BackButton({ onBackPress }: BackButtonProps) {
  return (
    <TouchableOpacity className="flex-row items-center" onPress={onBackPress} activeOpacity={0.7}>
      <Icon name={ArrowLeft} size={20} lightColor="black" darkColor="white" />
    </TouchableOpacity>
  );
}
