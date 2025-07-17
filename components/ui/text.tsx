import { useThemeColor } from '@/hooks/useThemeColor';
import { FONT_SIZE } from '@/theme/globals';
import React, { forwardRef } from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

type TextVariant =
  | 'body'
  | 'title'
  | 'title-serif'
  | 'subtitle'
  | 'caption'
  | 'heading'
  | 'link'
  | 'small';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
  weight?: 'bold' | 'medium' | 'regular';
  fontSize?: 'small';
}

export const Text = forwardRef<RNText, TextProps>(
  (
    { variant = 'body', lightColor, darkColor, style, children, weight, fontSize, ...props },
    ref
  ) => {
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const mutedColor = useThemeColor({}, 'textMuted');

    const getTextStyle = (): TextStyle => {
      const baseStyle: TextStyle = {
        color: textColor,
        fontFamily: 'PlusJakartaSans_400Regular',
      };

      switch (variant) {
        case 'heading':
          return {
            ...baseStyle,
            fontSize: 28,
            fontFamily: 'PlusJakartaSans_700Bold',
          };
        case 'title':
          return {
            ...baseStyle,
            fontSize: 22,
            fontFamily: 'PlusJakartaSans_700Bold',
          };
        case 'subtitle':
          return {
            ...baseStyle,
            fontSize: 20,
          };
        case 'caption':
          return {
            ...baseStyle,
            fontSize: FONT_SIZE,
            color: mutedColor,
          };
        case 'link':
          return {
            ...baseStyle,
            fontSize: FONT_SIZE,
            textDecorationLine: 'underline',
          };

        default: // 'body'
          return {
            ...baseStyle,
            fontSize: FONT_SIZE,
          };
      }
    };

    function getFontWeight() {
      switch (weight) {
        case 'bold':
          return { fontFamily: 'PlusJakartaSans_700Bold' };
        case 'medium':
          return { fontFamily: 'PlusJakartaSans_500Medium' };
        case 'regular':
          return { fontFamily: 'PlusJakartaSans_400Regular' };
      }
    }

    function getFontSize() {
      switch (fontSize) {
        case 'small':
          return { fontSize: 14 };
      }
    }

    return (
      <RNText ref={ref} style={[getTextStyle(), getFontWeight(), getFontSize(), style]} {...props}>
        {children}
      </RNText>
    );
  }
);
