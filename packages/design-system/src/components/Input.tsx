import React, { useId, useMemo } from 'react';
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

const inputLabelStyle = tw.style('text-sm font-medium text-text mb-xs');

const inputErrorStyle = tw.style('text-xs text-error mt-xs');

const inputContainerStyle = tw.style('mb-md');

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
  const inputStyle = useMemo(() => tw.style(inputVariants({ hasError: !!error })), [error]);

  const inputId = useId();
  const labelId = `${inputId}-label`;
  const errorId = `${inputId}-error`;
  return (
    <View style={[inputContainerStyle, containerStyle]}>
      {label && <Text style={inputLabelStyle}>{label}</Text>}
      <TextInput
        style={[inputStyle, style]}
        placeholderTextColor={placeholderTextColor ?? colors.textSecondary}
        accessible={true}
        accessibilityLabel={label ? `${label}${error ? `, 오류: ${error}` : ''}` : undefined}
        accessibilityLabelledBy={label ? labelId : undefined}
        accessibilityHint={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <Text nativeID={errorId} style={inputErrorStyle} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
};
