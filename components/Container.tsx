import { cn } from '@/utils';
import { ReactNode } from 'react';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  edges?: Edge[];
};

export const Container = ({ children, className, edges = ['top'] }: ContainerProps) => {
  return (
    <SafeAreaView className={cn('flex-1 p-4 pb-0 flex-col gap-4', className)} edges={edges}>
      {children}
    </SafeAreaView>
  );
};
