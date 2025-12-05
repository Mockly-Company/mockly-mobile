import { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  SlideInUp,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';

type SlideDirection = 'up' | 'down' | 'left' | 'right';

interface SlideInAnimationProps extends PropsWithChildren {
  direction?: SlideDirection;
  delay?: number;
  style?: ViewStyle;
  useSpring?: boolean;
}

const slideInMap = {
  up: SlideInUp,
  down: SlideInDown,
  left: SlideInLeft,
  right: SlideInRight,
};

export const SlideInAnimation = ({
  direction = 'up',
  delay = 0,
  style,
  useSpring = true,
  children,
}: SlideInAnimationProps) => {
  const Animation = slideInMap[direction] || SlideInUp;
  const entering = useSpring ? Animation.delay(delay).springify() : Animation.delay(delay);
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
};
