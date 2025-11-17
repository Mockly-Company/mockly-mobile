import React from 'react';
import { View, ViewProps } from 'react-native';
import { tw } from '../lib/tw';

export interface StackProps extends ViewProps {
  direction?: 'vertical' | 'horizontal';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const spacingMap = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',
} as const;

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  style,
  children,
  ...props
}) => {
  const directionStyle = direction === 'vertical' ? 'flex-col' : 'flex-row';
  const gapValue = spacingMap[spacing];
  const alignStyle = alignMap[align];
  const justifyStyle = justifyMap[justify];

  return (
    <View
      style={[tw`flex ${directionStyle} gap-${gapValue} ${alignStyle} ${justifyStyle}`, style]}
      {...props}
    >
      {children}
    </View>
  );
};
