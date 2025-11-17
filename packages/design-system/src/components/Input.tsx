import React from 'react';
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
}

export const Input: React.FC<InputProps> = ({ label, error, containerStyle, style, ...props }) => {
  const inputClass = inputVariants({ hasError: !!error });
  const labelClass = inputLabelVariants();
  const errorClass = inputErrorVariants();
  const containerClass = inputContainerVariants();

  return (
    <View style={[tw.style(containerClass), containerStyle]}>
      {label && <Text style={tw.style(labelClass)}>{label}</Text>}
      <TextInput
        style={[tw.style(inputClass), style]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={tw.style(errorClass)}>{error}</Text>}
    </View>
  );
};
