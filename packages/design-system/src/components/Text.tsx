import React, { useMemo } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../lib/tw';

const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-xxl font-bold',
      h2: 'text-xl font-bold',
      h3: 'text-lg font-semibold',
      body: 'text-md',
      caption: 'text-sm',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      text: 'text-text',
      textSecondary: 'text-text-secondary',
      background: 'text-background',
      border: 'text-border',
      surface: 'text-surface',
      accent: 'text-accent',
    },
  },
  defaultVariants: {
    variant: 'body',
    weight: 'normal',
    color: 'text',
  },
});

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'normal',
  style,
  ...props
}) => {
  const textStyle = useMemo(
    () => textVariants({ variant, weight, color }),
    [weight, variant, color]
  );
  const accessibilityRole = variant?.startsWith('h') ? 'header' : 'text';
  return (
    <RNText accessibilityRole={accessibilityRole} style={[tw.style(textStyle), style]} {...props} />
  );
};
