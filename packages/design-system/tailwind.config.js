import { colors, spacing, typography, borderRadius } from './dist/theme/index.js';

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
      },
      spacing: {
        xs: `${spacing.xs}px`,
        sm: `${spacing.sm}px`,
        md: `${spacing.md}px`,
        lg: `${spacing.lg}px`,
        xl: `${spacing.xl}px`,
        xxl: `${spacing.xxl}px`,
      },
      fontSize: {
        xs: `${typography.fontSize.xs}px`,
        sm: `${typography.fontSize.sm}px`,
        md: `${typography.fontSize.md}px`,
        lg: `${typography.fontSize.lg}px`,
        xl: `${typography.fontSize.xl}px`,
        xxl: `${typography.fontSize.xxl}px`,
      },
      fontWeight: {
        regular: typography.fontWeight.regular,
        medium: typography.fontWeight.medium,
        semibold: typography.fontWeight.semibold,
        bold: typography.fontWeight.bold,
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
  plugins: [],
};
export default config;
