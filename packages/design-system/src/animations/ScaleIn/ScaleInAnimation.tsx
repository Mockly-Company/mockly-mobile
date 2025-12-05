import { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

interface ScaleInAnimationProps extends PropsWithChildren {
  delay?: number;
  style?: ViewStyle;
  useSpring?: boolean;
}

export const ScaleInAnimation = ({
  delay = 0,
  style,
  useSpring = true,
  children,
}: ScaleInAnimationProps) => {
  const entering = useSpring ? ZoomIn.delay(delay).springify() : ZoomIn.delay(delay);
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
};
