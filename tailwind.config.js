const colors = require('./theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base colors

        background: colors.lightColors.background,
        foreground: colors.lightColors.foreground,

        // Card colors
        card: colors.lightColors.card,
        'card-foreground': colors.lightColors.cardForeground,

        // Primary colors
        primary: colors.lightColors.primary,
        'primary-foreground': colors.lightColors.primaryForeground,

        // Secondary colors
        secondary: colors.lightColors.secondary,
        'secondary-foreground': colors.lightColors.secondaryForeground,

        // Muted colors
        muted: colors.lightColors.muted,
        'muted-foreground': colors.lightColors.mutedForeground,

        // Accent colors
        accent: colors.lightColors.accent,
        'accent-foreground': colors.lightColors.accentForeground,

        // Destructive colors
        destructive: colors.lightColors.destructive,
        'destructive-foreground': colors.lightColors.destructiveForeground,

        // Border and input
        border: colors.lightColors.border,
        input: colors.lightColors.input,
        ring: colors.lightColors.ring,

        // Text colors
        text: colors.lightColors.text,
        'text-muted': colors.lightColors.textMuted,
      },
    },
  },
  plugins: [
    // Plugin to add dark mode variants
    function ({ addUtilities, theme }) {
      const darkColors = require('./theme/colors').darkColors;

      addUtilities({
        '.dark .bg-background': { backgroundColor: darkColors.background },
        '.dark .border-background': { borderColor: darkColors.background },
        '.dark .text-foreground': { color: darkColors.foreground },
        '.dark .bg-card': { backgroundColor: darkColors.card },
        '.dark .text-card-foreground': { color: darkColors.cardForeground },
        '.dark .bg-primary': { backgroundColor: darkColors.primary },
        '.dark .text-primary-foreground': { color: darkColors.primaryForeground },
        '.dark .bg-secondary': { backgroundColor: darkColors.secondary },
        '.dark .text-secondary-foreground': { color: darkColors.secondaryForeground },
        '.dark .bg-muted': { backgroundColor: darkColors.muted },
        '.dark .text-muted-foreground': { color: darkColors.mutedForeground },
        '.dark .bg-accent': { backgroundColor: darkColors.accent },
        '.dark .text-accent-foreground': { color: darkColors.accentForeground },
        '.dark .bg-destructive': { backgroundColor: darkColors.destructive },
        '.dark .text-destructive-foreground': { color: darkColors.destructiveForeground },
        '.dark .border-border': { borderColor: darkColors.border },
        '.dark .bg-input': { backgroundColor: darkColors.input },
        '.dark .ring-ring': { outlineColor: darkColors.ring },
        '.dark .text-text': { color: darkColors.text },
        '.dark .text-text-muted': { color: darkColors.textMuted },
      });
    },
  ],
};
