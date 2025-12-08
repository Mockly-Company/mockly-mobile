import React, { useMemo } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Feather, { type FeatherIconName } from '@react-native-vector-icons/feather';
import { cva, type VariantProps } from 'class-variance-authority';

import { tw } from '../../lib/tw';

// cva를 사용한 variant 정의
const iconVariants = cva('', {
  variants: {
    variant: {
      primary: 'text-primary dark:text-primary-dark',
      secondary: 'text-secondary dark:text-secondary',
      error: 'text-error dark:text-error',
      warning: 'text-warning dark:text-warning',
      success: 'text-success dark:text-success',
      surface: 'text-surface dark:text-surface-dark',
      text: 'text-black dark:text-white',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

type IconVariant = VariantProps<typeof iconVariants>['variant'];

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
  // cva로 생성된 클래스를 tw로 변환
  const iconStyle = useMemo(() => {
    const variantClass = iconVariants({ variant });
    return [tw`${variantClass}`, style];
  }, [variant, style]);

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
