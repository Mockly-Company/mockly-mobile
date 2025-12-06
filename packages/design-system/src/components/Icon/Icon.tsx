import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';

import Feather, { type FeatherIconName } from '@react-native-vector-icons/feather';

export interface IconProps {
  name: FeatherIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityElementsHidden?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#222',
  style,
  accessibilityLabel,
  accessibilityElementsHidden = true,
}) => {
  const isHidden = accessibilityElementsHidden ?? !accessibilityLabel;
  return (
    <Feather
      name={name}
      size={size}
      color={color}
      style={style}
      accessibilityLabel={accessibilityLabel}
      accessible={!!accessibilityLabel}
      accessibilityElementsHidden={isHidden}
    />
  );
};
