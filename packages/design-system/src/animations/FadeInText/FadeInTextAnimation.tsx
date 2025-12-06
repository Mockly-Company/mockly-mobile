import { PropsWithChildren } from 'react';
import { TextStyle } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated';

export type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'default';

interface FadeInTextAnimationProps extends PropsWithChildren {
  direction?: FadeDirection;
  delay?: number;
  style?: TextStyle;
  useSpring?: boolean;
}

const fadeInMap = {
  up: FadeInUp,
  down: FadeInDown,
  left: FadeInLeft,
  right: FadeInRight,
  default: FadeIn,
};

export const FadeInTextAnimation = ({
  direction = 'default',
  delay = 0,
  children,
  style,
  useSpring = true,
}: FadeInTextAnimationProps) => {
  const Animation = fadeInMap[direction];
  const entering = useSpring ? Animation.delay(delay).springify() : Animation.delay(delay);
  return (
    <Animated.Text entering={entering} style={style}>
      {children}
    </Animated.Text>
  );
};
