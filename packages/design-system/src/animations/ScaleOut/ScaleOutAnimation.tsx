import { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { ZoomOut } from 'react-native-reanimated';

interface ScaleOutAnimationProps extends PropsWithChildren {
  delay?: number;
  style?: ViewStyle;
  useSpring?: boolean;
}

export const ScaleOutAnimation = ({
  delay = 0,
  style,
  useSpring = true,
  children,
}: ScaleOutAnimationProps) => {
  const exiting = useSpring ? ZoomOut.delay(delay).springify() : ZoomOut.delay(delay);
  return (
    <Animated.View exiting={exiting} style={style}>
      {children}
    </Animated.View>
  );
};
