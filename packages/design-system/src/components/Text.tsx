import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { colors } from '../theme';
import { cn } from '@mockly/utils';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: keyof typeof colors;
  weight?: TextStyle['fontWeight'];
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'regular',
  // style,
  ...props
}) => {
  return (
    <RNText
      className={cn(
        'text-red-500',
        'bg-red-50',
        {
          [`color-${color}`]: Boolean(color),
          [`${VariantToClassName[variant]}`]: Boolean(variant),
          [`font-${weight}`]: Boolean(weight),
        },
        'text-purple-600'
      )}
      // style={
      //   (style,
      //   StyleSheet.create({
      //     text: {
      //       color: '#FF4696',
      //       fontWeight: weight,
      //     },
      //   }).text)
      // }
      {...props}
    />
  );
};

const VariantToClassName = {
  h1: 'text-2xl font-bold',
  h2: 'text-xl font-bold',
  h3: 'text-lg font-semibold',
  body: 'text-md font-regular',
  caption: 'text-sm font-regular',
};
