import React from 'react';
import { View, ViewProps } from 'react-native';
import { tw } from '../lib/tw';

export interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const paddingMap = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',
} as const;

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  style,
  children,
  ...props
}) => {
  const baseStyle = tw`rounded-lg`;
  const paddingStyle = tw`p-${paddingMap[padding]}`;

  let variantStyle;
  switch (variant) {
    case 'elevated':
      variantStyle = tw`bg-background shadow-md`;
      break;
    case 'outlined':
      variantStyle = tw`bg-background border border-border`;
      break;
    case 'filled':
      variantStyle = tw`bg-surface`;
      break;
  }

  return (
    <View style={[baseStyle, variantStyle, paddingStyle, style]} {...props}>
      {children}
    </View>
  );
};
