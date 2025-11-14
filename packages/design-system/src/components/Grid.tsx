import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@mockly/utils';
import { cva, type VariantProps } from 'cva';

type GridVariant = VariantProps<typeof gridVariants>;
export interface GridProps extends ViewProps, GridVariant {
  columns?: number;
}
const gridVariants = cva('flex-row flex-wrap', {
  variants: {
    spacing: {
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      lg: 'gap-lg',
      xl: 'gap-xl',
      xxl: 'gap-xxl',
    },
  },
  defaultVariants: {
    spacing: 'md',
  },
});
export const Grid: React.FC<GridProps> = ({
  columns = 2,
  spacing = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <View
      className={cn('flex-row flex-wrap', gridVariants({ spacing }), className, 'gap-{10}')}
      {...props}
    >
      {React.Children.map(children, child => (
        <View style={{ flex: 1, minWidth: `${100 / columns}%` }}>{child}</View>
      ))}
    </View>
  );
};
