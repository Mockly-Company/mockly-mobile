import React from 'react';
import { View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../lib/tw';

const spacerVariants = cva('', {
  variants: {
    direction: {
      vertical: '',
      horizontal: '',
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
      xxl: '',
    },
  },
  compoundVariants: [
    // Vertical direction sizes
    { direction: 'vertical', size: 'xs', class: 'h-xs' },
    { direction: 'vertical', size: 'sm', class: 'h-sm' },
    { direction: 'vertical', size: 'md', class: 'h-md' },
    { direction: 'vertical', size: 'lg', class: 'h-lg' },
    { direction: 'vertical', size: 'xl', class: 'h-xl' },
    { direction: 'vertical', size: 'xxl', class: 'h-xxl' },
    // Horizontal direction sizes
    { direction: 'horizontal', size: 'xs', class: 'w-xs' },
    { direction: 'horizontal', size: 'sm', class: 'w-sm' },
    { direction: 'horizontal', size: 'md', class: 'w-md' },
    { direction: 'horizontal', size: 'lg', class: 'w-lg' },
    { direction: 'horizontal', size: 'xl', class: 'w-xl' },
    { direction: 'horizontal', size: 'xxl', class: 'w-xxl' },
  ],
  defaultVariants: {
    size: 'md',
    direction: 'vertical',
  },
});

export interface SpacerProps extends ViewProps, VariantProps<typeof spacerVariants> {}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  style,
  ...props
}) => {
  const spacerClass = spacerVariants({ size, direction });

  return <View style={[tw.style(spacerClass), style]} {...props} />;
};
