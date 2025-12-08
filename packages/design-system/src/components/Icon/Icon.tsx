import React, { useMemo } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Feather, { type FeatherIconName } from '@react-native-vector-icons/feather';

import { tw } from '../../lib/tw';

// variant별 tw 스타일 반환
const iconVariantTw = (variant: IconVariant = 'primary') => {
  switch (variant) {
    case 'primary':
      return tw`text-primary dark:text-primary`;
    case 'secondary':
      return tw`text-secondary dark:text-secondary`;
    case 'error':
      return tw`text-error dark:text-error`;
    case 'warning':
      return tw`text-warning dark:text-warning`;
    case 'success':
      return tw`text-success dark:text-success`;
    case 'surface':
      return tw`text-surface dark:text-surface`;
    case 'text':
      return tw`text-black dark:text-white`;
    default:
      return tw`text-primary dark:text-primary`;
  }
};

type IconVariant = 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'surface' | 'text';

export interface IconProps {
  name: FeatherIconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityElementsHidden?: boolean;
  variant?: IconVariant;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  style,
  accessibilityLabel,
  accessibilityElementsHidden = true,
  variant = 'primary',
}) => {
  const isHidden = accessibilityElementsHidden ?? !accessibilityLabel;
  // cva로 관리되는 Tailwind 색상 클래스를 hex로 변환
  const iconStyle = useMemo(() => [iconVariantTw(variant), style], [variant, style]);
  return (
    <Feather
      name={name}
      size={size}
      style={iconStyle}
      accessibilityLabel={accessibilityLabel}
      accessible={!!accessibilityLabel}
      accessibilityElementsHidden={isHidden}
    />
  );
};
