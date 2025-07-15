import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

const Sheet = React.forwardRef<
  BottomSheetModal,
  React.ComponentPropsWithoutRef<typeof BottomSheetModal>
>(({ index = 0, backgroundStyle, style, handleIndicatorStyle, ...props }, ref) => {
  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
    []
  );

  const border = useThemeColor({}, 'border');
  const card = useThemeColor({}, 'card');

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backgroundStyle={
        backgroundStyle ?? {
          backgroundColor: card,
        }
      }
      style={
        style ?? {
          borderTopStartRadius: 16,
          borderTopEndRadius: 16,
        }
      }
      handleIndicatorStyle={
        handleIndicatorStyle ?? {
          backgroundColor: border,
        }
      }
      backdropComponent={renderBackdrop}
      {...props}
    />
  );
});

function useSheetRef() {
  return React.useRef<BottomSheetModal>(null);
}

export { Sheet, useSheetRef };
