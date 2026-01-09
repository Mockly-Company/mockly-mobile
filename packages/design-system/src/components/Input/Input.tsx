import React, { RefObject, useId, useMemo } from 'react';
import { TextInput, View, Text, TextInputProps, ViewStyle } from 'react-native';
import { cva } from 'cva';
import { tw } from '../../lib/tw';
import { colors } from '../../theme';

const inputVariants = cva({
  base: ' px-md py-md text-md text-text dark:text-text-dark',
  variants: {
    hasError: {
      true: 'border-error dark:border-error',
    },
    variant: {
      outlined: 'border bg-surface dark:bg-surface border-border dark:border-border',
      rounded: 'border bg-surface dark:bg-surface border-border dark:border-border rounded-md',
      underlined: 'border-b border-b-border',
    },
  },
});

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  placeholderTextColor?: string;
  ref?: RefObject<TextInput | null>;
  variant?: 'outlined' | 'underlined' | 'rounded';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  placeholderTextColor,
  variant = 'outlined',
  ...props
}) => {
  const inputId = useId();
  const labelId = `${inputId}-label`;
  const errorId = `${inputId}-error`;
  const placeholderColor = useMemo(
    () =>
      placeholderTextColor ??
      (tw.color('text-text-secondary dark:text-text-secondary') || colors.textSecondary),
    [placeholderTextColor]
  );
  return (
    <View style={[tw`mb-md`, containerStyle]}>
      {label && (
        <Text style={tw`text-sm font-medium text-text dark:text-text-dark mb-xs`}>{label}</Text>
      )}
      <TextInput
        style={[tw`${inputVariants({ hasError: !!error, variant })}`, style]}
        placeholderTextColor={placeholderColor}
        accessible={true}
        accessibilityLabel={label ? `${label}${error ? `, 오류: ${error}` : ''}` : undefined}
        accessibilityLabelledBy={label ? labelId : undefined}
        accessibilityHint={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <Text
          nativeID={errorId}
          style={tw`text-xs text-error dark:text-error mt-xs`}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
};
