import { colors } from './dist/theme/index.js';
import nativewindPreset from 'nativewind/preset';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [nativewindPreset],
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
    },
  },
  plugins: [],
};
export default config;
