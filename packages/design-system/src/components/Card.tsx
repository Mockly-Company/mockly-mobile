import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import LinearGradient from 'react-native-linear-gradient';
import { tw } from '../lib/tw';

const cardVariants = cva('rounded-lg', {
  variants: {
    variant: {
      elevated: 'bg-background shadow-md',
      outlined: 'bg-background border border-border',
      filled: 'bg-surface',
      gradient: 'overflow-hidden',
      transparent: 'bg-transparent border-border',
    },
    padding: {
      xs: 'p-xs',
      sm: 'p-sm',
      md: 'p-md',
      lg: 'p-lg',
      xl: 'p-xl',
      xxl: 'p-xxl',
    },
  },
  defaultVariants: {
    variant: 'elevated',
    padding: 'md',
  },
});

export interface CardProps extends ViewProps, VariantProps<typeof cardVariants> {
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  style,
  children,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
  ...props
}) => {
  const cardStyle = useMemo(() => tw.style(cardVariants({ variant, padding })), [variant, padding]);

  if (variant === 'gradient' && gradientColors) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[cardStyle, style]}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};
