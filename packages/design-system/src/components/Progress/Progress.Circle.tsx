import { useEffect, useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { tw } from '../../lib/tw';
import { useProgress } from './Progress';

const variantColors = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export type ProgressCircleProps = ViewProps & {
  size?: number;
  strokeWidth?: number;
  duration?: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressCircle = ({
  style,
  size = 120,
  strokeWidth = 8,
  duration = 600,
  children,
  ...props
}: ProgressCircleProps) => {
  const { percent, variant } = useProgress();
  const animatedProgress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeColor = useMemo(() => variantColors[variant], [variant]);

  useEffect(() => {
    animatedProgress.value = withTiming(percent, { duration });
  }, [percent, duration, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (animatedProgress.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View
      style={[tw`justify-center items-center`, { width: size, height: size }, style]}
      {...props}
    >
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>
      {children && <View style={tw`absolute justify-center items-center`}>{children}</View>}
    </View>
  );
};
