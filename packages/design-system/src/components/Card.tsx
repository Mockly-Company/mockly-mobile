import React from 'react';
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
  const cardClass = cardVariants({ variant, padding });

  return (
    <View style={[tw.style(cardClass), style]} {...props}>
      {children}
    </View>
  );
};
