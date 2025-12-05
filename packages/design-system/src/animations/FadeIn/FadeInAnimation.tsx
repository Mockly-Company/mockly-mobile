import { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated';

type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'default';

interface FadeInAnimationProps extends PropsWithChildren {
  direction?: FadeDirection;
  delay?: number;
  style?: ViewStyle;
  useSpring?: boolean;
}

const fadeInMap = {
  up: FadeInUp,
  down: FadeInDown,
  left: FadeInLeft,
  right: FadeInRight,
  default: FadeIn,
};

export const FadeInAnimation = ({
  direction = 'default',
  delay = 0,
  children,
  style,
  useSpring = true,
}: FadeInAnimationProps) => {
  const Animation = fadeInMap[direction] || fadeInMap.default;
  const entering = useSpring ? Animation.delay(delay).springify() : Animation.delay(delay);
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
};
