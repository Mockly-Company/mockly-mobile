import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../../lib/tw';

const textVariants = cva({
  base: '',
  variants: {
    variant: {
      h1: 'text-2xl font-bold',
      h2: 'text-xl font-bold',
      h3: 'text-lg font-semibold',
      h4: 'text-md font-semibold',
      h5: 'text-sm font-medium',
      body: 'text-md',
      caption: 'text-sm',
      caption2: 'text-xs',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      primary: 'text-primary dark:text-primary-dark',
      secondary: 'text-secondary dark:text-secondary-dark',
      success: 'text-success dark:text-success-dark',
      warning: 'text-warning dark:text-warning-dark',
      error: 'text-error dark:text-error-dark',
      text: 'text-text dark:text-text-dark',
      textSecondary: 'text-text-secondary dark:text-text-secondary-dark',
      background: 'text-background dark:text-background-dark',
      border: 'text-border dark:text-border-dark',
      surface: 'text-surface dark:text-surface-dark',
      accent: 'text-accent dark:text-accent-dark',
      white: 'text-white',
      black: 'text-black',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'body',
    weight: 'normal',
    color: 'text',
    align: 'left',
  },
});

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {}
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'normal',
  align = 'left',
  style,
  ...props
}) => {
  const accessibilityRole = variant && variant.startsWith('h') ? 'header' : 'text';
  return (
    <RNText
      accessibilityRole={accessibilityRole}
      style={[tw.style(textVariants({ variant, weight, color, align })), style]}
      {...props}
    />
  );
};
