import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../../lib/tw';

const stackVariants = cva('flex', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    spacing: {
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      lg: 'gap-lg',
      xl: 'gap-xl',
      '2xl': 'gap-2xl',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    spacing: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

export interface StackProps extends ViewProps, VariantProps<typeof stackVariants> {}

export const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  style,
  children,
  ...props
}) => {
  const stackStyle = useMemo(
    () => tw.style(stackVariants({ direction, spacing, align, justify })),
    [direction, spacing, align, justify]
  );

  return (
    <View style={[stackStyle, style]} {...props}>
      {children}
    </View>
  );
};
