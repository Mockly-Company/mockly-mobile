import React, { useId, useMemo } from 'react';
import { TextInput, View, Text, TextInputProps, ViewStyle } from 'react-native';
import { cva } from 'cva';
import { tw } from '../../lib/tw';
import { colors } from '../../theme';

const inputVariants = cva({
  base: 'bg-surface dark:bg-surface border border-border dark:border-border rounded-md px-md py-md text-md text-text dark:text-text',
  variants: {
    hasError: {
      true: 'border-error dark:border-error',
    },
  },
});

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
    <View style={[tw`mb-md`, containerStyle]}>
      {label && (
        <Text style={tw`text-sm font-medium text-text dark:text-text-dark mb-xs`}>{label}</Text>
      )}
      <TextInput
        style={[inputStyle, style]}
        placeholderTextColor={
          placeholderTextColor ??
          (tw.color('text-textSecondary dark:text-textSecondary') || colors.textSecondary)
        }
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
