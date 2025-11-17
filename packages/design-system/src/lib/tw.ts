import { create } from 'twrnc';
import { colors, spacing, typography, borderRadius } from '../theme';

// Create customized tw instance with design system theme
export const tw = create({
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
      borderRadius: {
        sm: `${borderRadius.sm}px`,
        md: `${borderRadius.md}px`,
        lg: `${borderRadius.lg}px`,
        xl: `${borderRadius.xl}px`,
        full: `${borderRadius.full}px`,
      },
    },
  },
});

export default tw;
