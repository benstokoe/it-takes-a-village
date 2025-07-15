import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Sheet, useSheetRef } from '@/components/sheet';
import { Container } from '@/components/container';
import { Text } from '@/components/ui/text';

type BottomSheetProps = {
  ref: ReturnType<typeof useSheetRef>;
  children: React.ReactNode;
  title?: string;
};

export function BottomSheet({ ref, children, title }: BottomSheetProps) {
  return (
    <Sheet ref={ref}>
      <BottomSheetView>
        <Container edges={['bottom']}>
          {title && <Text variant="title">{title}</Text>}
          {children}
        </Container>
      </BottomSheetView>
    </Sheet>
  );
}
