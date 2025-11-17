import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../lib/tw';

// Button container variants using CVA
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

// Button text variants using CVA
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
    Omit<VariantProps<typeof buttonVariants>, 'disabled'> {
  children: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  style,
  disabled,
  ...props
}) => {
  const buttonClass = buttonVariants({ variant, size, disabled });
  const textClass = buttonTextVariants({ variant, size });

  return (
    <TouchableOpacity style={[tw.style(buttonClass), style]} disabled={disabled} {...props}>
      <Text style={tw.style(textClass)}>{children}</Text>
    </TouchableOpacity>
  );
};
