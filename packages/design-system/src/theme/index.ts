// Color Palette (50-900 scale)
export const palette = {
  orange: {
    50: '#FFF5F2',
    100: '#FFE8E0',
    200: '#FFD1C1',
    300: '#FFB394',
    400: '#FF8A5B',
    500: '#FF6B35', // Primary
    600: '#E55A28',
    700: '#C54A1E',
    800: '#A03D18',
    900: '#7A2E12',
  },
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#5BA3F5', // Secondary Dark
    500: '#4A90E2', // Secondary
    600: '#3B82F6',
    700: '#2563EB',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  pink: {
    50: '#FEF5FA',
    100: '#FDEAF4',
    200: '#FCD5E9',
    300: '#FAB3D9',
    400: '#FD79A8', // Accent
    500: '#F472B6',
    600: '#EC4899',
    700: '#DB2777',
    800: '#BE185D',
    900: '#9F1239',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#2ECC71', // Success
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  yellow: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FDCB6E', // Warning
    500: '#EAB308',
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#E17055', // Error
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  gray: {
    50: '#F8F9FC', // Surface Light
    100: '#F3F4F6',
    200: '#E5E7EB', // Border Light
    300: '#D1D5DB',
    400: '#A0A0A0', // Text Secondary Dark
    500: '#6B7280', // Text Secondary Light
    600: '#4B5563',
    700: '#404040', // Border Dark
    800: '#2D2D2D', // Surface Dark
    900: '#1A1A1A', // Background Dark
  },
  neutral: {
    white: '#FFFFFF',
    black: '#111111',
    transparent: 'transparent',
  },
};

export const lightColors = {
  primary: palette.orange[500],
  secondary: palette.blue[500],
  accent: palette.pink[400],
  success: palette.green[500],
  warning: palette.yellow[400],
  error: palette.red[500],
  background: palette.neutral.white,
  surface: palette.gray[50],
  text: palette.neutral.black,
  textSecondary: palette.gray[500],
  border: palette.gray[200],
};

export const darkColors = {
  primary: palette.orange[400],
  secondary: palette.blue[400],
  accent: palette.pink[400],
  success: palette.green[500],
  warning: palette.yellow[400],
  error: palette.red[500],
  background: palette.gray[900],
  surface: palette.gray[800],
  text: palette.neutral.white,
  textSecondary: palette.gray[400],
  border: palette.gray[700],
};

export const colors = {
  ...lightColors,
  surfaceDark: darkColors.surface,
  backgroundDark: darkColors.background,
  borderDark: darkColors.border,
  primaryDark: darkColors.primary,
  secondaryDark: darkColors.secondary,
  textDark: darkColors.text,
  textSecondaryDark: darkColors.textSecondary,
  successDark: darkColors.success,
  errorDark: darkColors.error,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const theme = {
  palette,
  colors,
  spacing,
  typography,
  borderRadius,
};

export default theme;
