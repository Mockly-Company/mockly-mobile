import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../../lib/tw';

const spacerVariants = cva({
  base: '',
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
      '2xl': '',
    },
  },
  compoundVariants: [
    // Vertical direction sizes
    { direction: 'vertical', size: 'xs', class: 'h-xs' },
    { direction: 'vertical', size: 'sm', class: 'h-sm' },
    { direction: 'vertical', size: 'md', class: 'h-md' },
    { direction: 'vertical', size: 'lg', class: 'h-lg' },
    { direction: 'vertical', size: 'xl', class: 'h-xl' },
    { direction: 'vertical', size: '2xl', class: 'h-2xl' },
    // Horizontal direction sizes
    { direction: 'horizontal', size: 'xs', class: 'w-xs' },
    { direction: 'horizontal', size: 'sm', class: 'w-sm' },
    { direction: 'horizontal', size: 'md', class: 'w-md' },
    { direction: 'horizontal', size: 'lg', class: 'w-lg' },
    { direction: 'horizontal', size: 'xl', class: 'w-xl' },
    { direction: 'horizontal', size: '2xl', class: 'w-2xl' },
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
  const spacerStyle = useMemo(
    () => tw.style(spacerVariants({ size, direction })),
    [size, direction]
  );

  return <View style={[spacerStyle, style]} {...props} />;
};
