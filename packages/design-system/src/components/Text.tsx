import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { colors } from '../theme';
import { tw } from '../lib/tw';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: keyof typeof colors;
  weight?: TextStyle['fontWeight'];
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'regular',
  style,
  ...props
}) => {
  const variantStyle = VariantStyles[variant];
  const colorStyle = { color: colors[color] };
  const weightStyle = { fontWeight: weight };

  return <RNText style={[variantStyle, colorStyle, weightStyle, style]} {...props} />;
};

const VariantStyles = {
  h1: tw`text-xxl font-bold`,
  h2: tw`text-xl font-bold`,
  h3: tw`text-lg font-semibold`,
  body: tw`text-md`,
  caption: tw`text-sm`,
};
