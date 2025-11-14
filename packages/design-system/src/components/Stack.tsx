import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { cn } from '@mockly/utils';
import { cva, VariantProps } from 'cva';

type StackVariant = VariantProps<typeof stackVariants>;
export interface StackProps extends ViewProps, StackVariant {}
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
      xxl: 'gap-xxl',
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

export const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  className,
  children,
  ...props
}) => {
  return (
    <View
      className={cn(
        stackVariants({ direction, spacing, align, justify }),
        className,
        'flex',
        'flex-row',
        'flex-1',
        'w-150',
        'bg-secondary'
      )}
      {...props}
    >
      <View className="bg-secondary">
        <Text>뭐냐</Text>
      </View>
      {children}
    </View>
  );
};
