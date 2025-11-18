import React, { PropsWithChildren, useMemo } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { cva, type VariantProps } from 'cva';

import { tw } from '../lib/tw';

const buttonVariants = cva('items-center justify-center rounded-md', {
  variants: {
    variant: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      outline: 'bg-transparent border border-primary',
    },
    size: {
      small: 'py-sm px-md',
      medium: 'py-md px-lg',
      large: 'py-md px-xl',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

const buttonTextVariants = cva('font-semibold', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-primary',
    },
    size: {
      small: 'text-sm',
      medium: 'text-md',
      large: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export interface ButtonProps
  extends TouchableOpacityProps,
    Omit<VariantProps<typeof buttonVariants>, 'disabled'>,
    PropsWithChildren {}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  style,
  disabled,
  ...props
}) => {
  const buttonStyle = useMemo(
    () => tw.style(buttonVariants({ variant, size, disabled })),
    [variant, size, disabled]
  );
  const textStyle = useMemo(() => tw.style(buttonTextVariants({ variant, size })), [variant, size]);

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...props}
    >
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};
