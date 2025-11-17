import React from 'react';
import { View, ViewProps } from 'react-native';
import { tw } from '../lib/tw';

export interface SpacerProps extends ViewProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  direction?: 'vertical' | 'horizontal';
}

const sizeMap = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',
} as const;

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  style,
  ...props
}) => {
  const sizeValue = sizeMap[size];
  const spacerStyle = direction === 'vertical' ? tw`h-${sizeValue}` : tw`w-${sizeValue}`;

  return <View style={[spacerStyle, style]} {...props} />;
};
