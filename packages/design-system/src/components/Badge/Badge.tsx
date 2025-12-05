import React, { PropsWithChildren, useMemo } from 'react';
import { View, Text as RNText, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../../lib/tw';

const badgeContainer = cva('items-center justify-center rounded-full border', {
  variants: {
    variant: {
      soft: '',
      solid: '',
      outline: 'bg-transparent',
    },
    color: {
      primary: '',
      success: '',
      warning: '',
      neutral: '',
    },
    size: {
      sm: 'px-sm py-xs',
      md: 'px-sm py-xs',
    },
  },
  compoundVariants: [
    // soft variants
    { variant: 'soft', color: 'primary', class: 'bg-primary/10 border-primary/20' },
    { variant: 'soft', color: 'success', class: 'bg-success/10 border-success/20' },
    { variant: 'soft', color: 'warning', class: 'bg-warning/10 border-warning/20' },
    { variant: 'soft', color: 'neutral', class: 'bg-surface border-border' },
    // solid variants
    { variant: 'solid', color: 'primary', class: 'bg-primary border-primary' },
    { variant: 'solid', color: 'success', class: 'bg-success border-success' },
    { variant: 'solid', color: 'warning', class: 'bg-warning border-warning' },
    { variant: 'solid', color: 'neutral', class: 'bg-text border-text' },
    // outline variants
    { variant: 'outline', color: 'primary', class: 'border-primary' },
    { variant: 'outline', color: 'success', class: 'border-success' },
    { variant: 'outline', color: 'warning', class: 'border-warning' },
    { variant: 'outline', color: 'neutral', class: 'border-border' },
  ],
  defaultVariants: {
    variant: 'soft',
    color: 'primary',
    size: 'sm',
  },
});

const badgeText = cva('font-bold', {
  variants: {
    variant: {
      soft: '',
      solid: 'text-white',
      outline: '',
    },
    color: {
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      neutral: 'text-text-secondary',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
    },
  },
  compoundVariants: [
    { variant: 'solid', color: 'primary', class: 'text-white' },
    { variant: 'solid', color: 'success', class: 'text-white' },
    { variant: 'solid', color: 'warning', class: 'text-white' },
    { variant: 'solid', color: 'neutral', class: 'text-white' },
  ],
  defaultVariants: {
    variant: 'soft',
    color: 'primary',
    size: 'sm',
  },
});

export interface BadgeProps
  extends ViewProps,
    Omit<VariantProps<typeof badgeContainer>, 'color'>,
    PropsWithChildren {
  color?: 'primary' | 'success' | 'warning' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'soft',
  color = 'primary',
  size = 'sm',
  style,
  children,
  ...props
}) => {
  const containerStyle = useMemo(
    () => tw.style(badgeContainer({ variant, color, size })),
    [variant, color, size]
  );

  const textStyle = useMemo(
    () => tw.style(badgeText({ variant, color, size })),
    [variant, color, size]
  );

  return (
    <View
      style={[containerStyle, style]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      {...props}
    >
      <RNText style={textStyle}>{children}</RNText>
    </View>
  );
};
