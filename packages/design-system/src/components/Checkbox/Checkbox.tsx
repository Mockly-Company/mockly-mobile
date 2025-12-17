import React, { useMemo } from 'react';
import { TouchableOpacity, View, TouchableOpacityProps } from 'react-native';
import { cva, type VariantProps } from 'cva';

import { tw } from '../../lib/tw';
import { Text } from '../Text';
import { Icon } from '../Icon';
const checkboxBoxVariants = cva({
  base: 'rounded border-2 items-center justify-center',
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    },
    checked: {
      true: 'bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark',
      false: 'bg-transparent border-black dark:border-white',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: {
    size: 'md',
    checked: false,
  },
});

const checkIconVariants = cva({
  base: 'text-white',
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface CheckboxProps
  extends Omit<TouchableOpacityProps, 'onPress'>,
    Omit<VariantProps<typeof checkboxBoxVariants>, 'checked' | 'disabled'> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  label,
  size = 'md',
  disabled = false,
  style,
  ...props
}) => {
  const boxStyle = useMemo(
    () => tw.style(checkboxBoxVariants({ size, checked, disabled })),
    [size, checked, disabled]
  );

  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[tw`flex-row items-center`, style]}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      {...props}
    >
      <View style={boxStyle}>
        {checked && (
          <Icon style={tw`${checkIconVariants({ size })}`} name="check" variant={'text'} />
        )}
      </View>
      {label && (
        <Text variant="body" style={tw`ml-2 flex-1`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};
