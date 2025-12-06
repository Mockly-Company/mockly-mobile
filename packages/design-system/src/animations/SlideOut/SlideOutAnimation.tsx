import { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  SlideOutUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';

type SlideDirection = 'up' | 'down' | 'left' | 'right';

interface SlideOutAnimationProps extends PropsWithChildren {
  direction?: SlideDirection;
  delay?: number;
  style?: ViewStyle;
  useSpring?: boolean;
}

const slideOutMap = {
  up: SlideOutUp,
  down: SlideOutDown,
  left: SlideOutLeft,
  right: SlideOutRight,
};

export const SlideOutAnimation = ({
  direction = 'up',
  delay = 0,
  style,
  useSpring = true,
  children,
}: SlideOutAnimationProps) => {
  const Animation = slideOutMap[direction] || SlideOutUp;
  const exiting = useSpring ? Animation.delay(delay).springify() : Animation.delay(delay);
  return (
    <Animated.View exiting={exiting} style={style}>
      {children}
    </Animated.View>
  );
};
