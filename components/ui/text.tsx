import { useThemeColor } from '@/hooks/useThemeColor';
import { FONT_SIZE } from '@/theme/globals';
import React, { forwardRef } from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

type TextVariant = 'body' | 'title' | 'title-serif' | 'subtitle' | 'caption' | 'heading' | 'link';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
  font?: 'serif' | 'sans-serif';
}

export const Text = forwardRef<RNText, TextProps>(
  ({ variant = 'body', lightColor, darkColor, font, style, children, ...props }, ref) => {
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const mutedColor = useThemeColor({}, 'textMuted');

    const getTextStyle = (): TextStyle => {
      const baseStyle: TextStyle = {
        color: textColor,
        fontFamily: 'SourceSansPro_400Regular',
      };

      switch (variant) {
        case 'heading':
          return {
            ...baseStyle,
            fontSize: 28,
            fontWeight: '800',
            fontFamily: 'DMSerifDisplay_400Regular',
          };
        case 'title':
          return {
            ...baseStyle,
            fontSize: 24,
            fontFamily: 'DMSerifDisplay_400Regular',
          };
        case 'subtitle':
          return {
            ...baseStyle,
            fontSize: 19,
            fontFamily: 'DMSerifDisplay_400Regular',
          };
        case 'caption':
          return {
            ...baseStyle,
            fontSize: FONT_SIZE,
            fontWeight: '400',
            color: mutedColor,
          };
        case 'link':
          return {
            ...baseStyle,
            fontSize: FONT_SIZE,
            fontWeight: '500',
            textDecorationLine: 'underline',
          };
        default: // 'body'
          return {
            ...baseStyle,
            fontSize: FONT_SIZE,
            fontWeight: '400',
          };
      }
    };

    const getFontFamily = () => {
      if (font === 'serif') {
        return { fontFamily: 'DMSerifDisplay_400Regular' };
      }

      if (font === 'sans-serif') {
        return { fontFamily: 'Outfit_400Regular' };
      }
    };

    return (
      <RNText ref={ref} style={[getTextStyle(), getFontFamily(), style]} {...props}>
        {children}
      </RNText>
    );
  }
);
