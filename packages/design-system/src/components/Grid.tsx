import React from 'react';
import { View, ViewProps } from 'react-native';
import { tw } from '../lib/tw';

export interface GridProps extends ViewProps {
  columns?: number;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const spacingMap = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',
} as const;

export const Grid: React.FC<GridProps> = ({
  columns = 2,
  spacing = 'md',
  style,
  children,
  ...props
}) => {
  const gapValue = spacingMap[spacing];

  return (
    <View style={[tw`flex-row flex-wrap gap-${gapValue}`, style]} {...props}>
      {React.Children.map(children, child => (
        <View style={{ flex: 1, minWidth: `${100 / columns}%` }}>{child}</View>
      ))}
    </View>
  );
};
