import { cn } from '@/utils';
import { SafeAreaView } from 'react-native-safe-area-context';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <SafeAreaView className={cn('flex-1 p-4 flex-col gap-4', className)}>{children}</SafeAreaView>
  );
};
