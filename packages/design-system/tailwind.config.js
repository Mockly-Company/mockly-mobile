const { colors, spacing, typography, borderRadius } = require('./src/theme');

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        background: colors.background,
        surface: colors.surface,
        text: colors.text,
        'text-secondary': colors.textSecondary,
        border: colors.border,
        'surface-dark': colors.surfaceDark,
        'background-dark': colors.backgroundDark,
        'border-dark': colors.borderDark,
        'primary-dark': colors.primaryDark,
        'secondary-dark': colors.secondaryDark,
        'text-secondary-dark': colors.textSecondaryDark,
        'text-dark': colors.textDark,
      },
      spacing: {
        xs: `${spacing.xs}px`,
        sm: `${spacing.sm}px`,
        md: `${spacing.md}px`,
        lg: `${spacing.lg}px`,
        xl: `${spacing.xl}px`,
        '2xl': `${spacing['2xl']}px`,
      },
      fontSize: {
        xs: `${typography.fontSize.xs}px`,
        sm: `${typography.fontSize.sm}px`,
        md: `${typography.fontSize.md}px`,
        lg: `${typography.fontSize.lg}px`,
        xl: `${typography.fontSize.xl}px`,
        '2xl': `${typography.fontSize['2xl']}px`,
        '3xl': `${typography.fontSize['3xl']}px`,
      },
      borderRadius: {
        sm: `${borderRadius.sm}px`,
        md: `${borderRadius.md}px`,
        lg: `${borderRadius.lg}px`,
        xl: `${borderRadius.xl}px`,
        full: `${borderRadius.full}px`,
      },
    },
  },
};

module.exports = config;
