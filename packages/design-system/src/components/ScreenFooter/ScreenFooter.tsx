import { StyleProp, View, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import tw from '../../lib/tw';
import { cn } from '@mockly/utils';

interface ScreenFooterProps {
  children: ReactNode;
  withBackground?: boolean;
  withShadow?: boolean;
  withBorder?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ScreenFooter({
  children,
  withBackground = false,
  withShadow = false,
  withBorder = false,
  style,
}: ScreenFooterProps) {
  return (
    <View
      style={[
        tw`${cn('px-6 py-4', {
          'bg-black': withBackground,
          'shadow-lg': withShadow,
          'border-t border-gray-800': withBorder,
        })}`,
        style,
      ]}
    >
      {children}
    </View>
  );
}
