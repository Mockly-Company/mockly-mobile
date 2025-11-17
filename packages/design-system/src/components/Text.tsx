import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../lib/tw';
import { colors } from '../theme';

const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-xxl font-bold',
      h2: 'text-xl font-bold',
      h3: 'text-lg font-semibold',
      body: 'text-md',
      caption: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});

const WeightMap = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {
  color?: keyof typeof colors;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'regular',
  style,
  ...props
}) => {
  const textClass = textVariants({ variant });
  const colorStyle = { color: colors[color] };
  const weightStyle = { fontWeight: WeightMap[weight] as TextStyle['fontWeight'] };

  return <RNText style={[tw.style(textClass), colorStyle, weightStyle, style]} {...props} />;
};
