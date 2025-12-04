import React, { useMemo } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../lib/tw';
import { Text } from './Text';

const iconButtonVariants = cva('items-center justify-center', {
  variants: {
    variant: {
      ghost: 'bg-transparent',
      filled: 'bg-primary',
      outline: 'bg-transparent border border-border',
    },
    size: {
      sm: 'w-8 h-8 rounded-md',
      md: 'w-10 h-10 rounded-lg',
      lg: 'w-12 h-12 rounded-xl',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'md',
  },
});

export interface IconButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof iconButtonVariants> {
  icon?: string; // simple emoji/text icon fallback
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  style,
  icon,
  children,
  ...props
}) => {
  const containerStyle = useMemo(
    () => tw.style(iconButtonVariants({ variant, size })),
    [variant, size]
  );
  return (
    <TouchableOpacity style={[containerStyle, style]} accessibilityRole="button" {...props}>
      {children ? children : icon ? <Text style={tw`text-lg`}>{icon}</Text> : null}
    </TouchableOpacity>
  );
};
