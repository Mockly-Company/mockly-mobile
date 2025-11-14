import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@mockly/utils';
import { cva, VariantProps } from 'cva';

type CardVariant = VariantProps<typeof cardVariants>;
export interface CardProps extends ViewProps, CardVariant {}
const cardVariants = cva('rounded-lg', {
  variants: {
    variant: {
      elevated: 'bg-primary shadow-md',
      outlined: 'bg-primary border border-border',
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
export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <View className={cn('rounded-lg', cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </View>
  );
};
