import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: keyof typeof colors;
  weight?: keyof typeof typography.fontWeight;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'regular',
  style,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles[variant],
        { color: colors[color] },
        { fontWeight: typography.fontWeight[weight] },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  h2: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  h3: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  body: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
  },
  caption: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
});
