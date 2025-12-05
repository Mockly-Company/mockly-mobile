import { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  FadeOut,
  FadeOutUp,
  FadeOutDown,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';

export type FadeOutDirection = 'up' | 'down' | 'left' | 'right' | 'default';

interface FadeOutAnimationProps extends PropsWithChildren {
  direction?: FadeOutDirection;
  delay?: number;
  style?: ViewStyle;
  useSpring?: boolean;
}

const fadeOutMap = {
  up: FadeOutUp,
  down: FadeOutDown,
  left: FadeOutLeft,
  right: FadeOutRight,
  default: FadeOut,
};

export const FadeOutAnimation = ({
  direction = 'default',
  delay = 0,
  children,
  style,
  useSpring = true,
}: FadeOutAnimationProps) => {
  const Animation = fadeOutMap[direction] || fadeOutMap.default;
  const exiting = useSpring ? Animation.delay(delay).springify() : Animation.delay(delay);
  return (
    <Animated.View exiting={exiting} style={style}>
      {children}
    </Animated.View>
  );
};
