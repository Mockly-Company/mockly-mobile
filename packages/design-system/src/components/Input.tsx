import React, { useId } from 'react';
import { TextInput, View, Text, TextInputProps, ViewStyle } from 'react-native';
import { cva } from 'cva';
import { tw } from '../lib/tw';
import { colors } from '../theme';

const inputVariants = cva(
  'bg-surface border border-border rounded-md px-md py-md text-md text-text',
  {
    variants: {
      hasError: {
        true: 'border-error',
      },
    },
  }
);

const inputLabelVariants = cva('text-sm font-medium text-text mb-xs');

const inputErrorVariants = cva('text-xs text-error mt-xs');

const inputContainerVariants = cva('mb-md');

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  placeholderTextColor?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  placeholderTextColor,
  ...props
}) => {
  const inputClass = inputVariants({ hasError: !!error });
  const labelClass = inputLabelVariants();
  const errorClass = inputErrorVariants();
  const containerClass = inputContainerVariants();
  const inputId = useId(); // 또는 props에서 받기
  const labelId = `${inputId}-label`;
  const errorId = `${inputId}-error`;
  return (
    <View style={[tw.style(containerClass), containerStyle]}>
      {label && <Text style={tw.style(labelClass)}>{label}</Text>}
      <TextInput
        style={[tw.style(inputClass), style]}
        placeholderTextColor={placeholderTextColor ?? colors.textSecondary}
        accessible={true}
        accessibilityLabel={label}
        accessibilityLabelledBy={label ? labelId : undefined}
        accessibilityHint={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <Text nativeID={errorId} style={tw.style(errorClass)} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
};
