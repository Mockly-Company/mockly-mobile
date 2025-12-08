import React, { createContext, useContext, useMemo, PropsWithChildren } from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  TextProps,
  View,
  ViewProps,
} from 'react-native';
import { cva, type VariantProps } from 'cva';

import { tw } from '../../lib/tw';

// ========================================
// Context
// ========================================

type ButtonContextValue = {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
};

const ButtonContext = createContext<ButtonContextValue | null>(null);

const useButtonContext = () => {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error('Button compound components must be used within a Button component');
  }
  return context;
};

// ========================================
// Variants
// ========================================

const buttonFrameVariants = cva({
  base: 'flex-row items-center justify-center rounded-md',
  variants: {
    variant: {
      primary: 'bg-primary dark:bg-primary-dark',
      secondary: 'bg-secondary dark:bg-secondary-dark',
      outline: 'bg-transparent border border-primary dark:border-primary-dark',
    },
    size: {
      small: 'py-sm px-sm',
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

const buttonTextVariants = cva({
  base: 'font-semibold',
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-primary dark:text-primary-dark',
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

const buttonIconVariants = cva({
  base: '',
  variants: {
    size: {
      small: 'w-4 h-4',
      medium: 'w-5 h-5',
      large: 'w-6 h-6',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

// ========================================
// Button (Root Component)
// ========================================

export interface ButtonProps
  extends TouchableOpacityProps,
    Omit<VariantProps<typeof buttonFrameVariants>, 'disabled'>,
    PropsWithChildren {}

const ButtonRoot: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  style,
  disabled,
  ...props
}) => {
  const contextValue = useMemo(
    () => ({
      variant,
      size,
      disabled,
    }),
    [variant, size, disabled]
  );
  const buttonStyle = useMemo(() => tw.style(buttonFrameVariants(contextValue)), [contextValue]);

  return (
    <ButtonContext.Provider value={contextValue}>
      <TouchableOpacity
        style={[buttonStyle, style]}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </ButtonContext.Provider>
  );
};

// ========================================
// Button.Text
// ========================================

export type ButtonTextProps = TextProps;

const ButtonText: React.FC<ButtonTextProps> = ({ style, children, ...props }) => {
  const { variant, size } = useButtonContext();

  const textStyle = useMemo(() => tw.style(buttonTextVariants({ variant, size })), [variant, size]);

  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
};

// ========================================
// Button.Icon
// ========================================

export type ButtonIconProps = ViewProps;

const ButtonIcon: React.FC<ButtonIconProps> = ({ style, children, ...props }) => {
  const { size } = useButtonContext();

  const iconStyle = useMemo(() => tw.style(buttonIconVariants({ size })), [size]);

  return (
    <View style={[iconStyle, style]} {...props}>
      {children}
    </View>
  );
};

// ========================================
// Export
// ========================================

export const Button = Object.assign(ButtonRoot, {
  Text: ButtonText,
  Icon: ButtonIcon,
});
