import { useEffect, useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { cva } from 'cva';

import { tw } from '../../lib/tw';
import { useProgress } from './Progress';

const progressBarVariants = cva({
  base: 'h-full rounded-full',
  variants: {
    variant: {
      primary: 'bg-primary dark:bg-primary-dark',
      success: 'bg-green-500 dark:bg-green-600',
      warning: 'bg-yellow-500 dark:bg-yellow-600',
      error: 'bg-red-500 dark:bg-red-600',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export type ProgressBarProps = ViewProps & {
  height?: number;
  duration?: number;
};

export const ProgressBar = ({ style, height = 8, duration = 600, ...props }: ProgressBarProps) => {
  const { percent, variant } = useProgress();
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(percent, { duration });
  }, [percent, duration, animatedWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  const barStyle = useMemo(() => tw.style(progressBarVariants({ variant })), [variant]);

  return (
    <View
      style={[tw`w-full overflow-hidden bg-gray-200 rounded-full`, { height }, style]}
      {...props}
    >
      <Animated.View style={[barStyle, animatedStyle]} />
    </View>
  );
};
