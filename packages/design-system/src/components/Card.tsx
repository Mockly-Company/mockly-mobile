import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../lib/tw';

const cardVariants = cva('rounded-lg', {
  variants: {
    variant: {
      elevated: 'bg-background shadow-md',
      outlined: 'bg-background border border-border',
      filled: 'bg-surface',
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

export interface CardProps extends ViewProps, VariantProps<typeof cardVariants> {}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  style,
  children,
  ...props
}) => {
  const cardStyle = useMemo(() => tw.style(cardVariants({ variant, padding })), [variant, padding]);
  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};
