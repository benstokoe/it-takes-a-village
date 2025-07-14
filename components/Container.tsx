import { cn } from '@/utils';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  edges?: Edge[];
};

export const Container = ({ children, className, edges = ['top', 'bottom'] }: ContainerProps) => {
  return (
    <SafeAreaView className={cn('flex-1 p-4 flex-col gap-4', className)} edges={edges}>
      {children}
    </SafeAreaView>
  );
};
