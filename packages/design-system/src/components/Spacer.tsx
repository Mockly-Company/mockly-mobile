import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@mockly/utils';

export interface SpacerProps extends ViewProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  direction?: 'vertical' | 'horizontal';
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  className,
  ...props
}) => {
  const sizeStyle = direction === 'vertical' ? VERTICAL_STYLES[size] : HORIZONTAL_STYLES[size];

  return <View className={cn(sizeStyle, className, 'h-xs')} {...props} />;
};

const VERTICAL_STYLES = {
  xs: 'h-xs',
  sm: 'h-sm',
  md: 'h-md',
  lg: 'h-lg',
  xl: 'h-xl',
  xxl: 'h-xxl',
};

const HORIZONTAL_STYLES = {
  xs: 'w-xs',
  sm: 'w-sm',
  md: 'w-md',
  lg: 'w-lg',
  xl: 'w-xl',
  xxl: 'w-xxl',
};
