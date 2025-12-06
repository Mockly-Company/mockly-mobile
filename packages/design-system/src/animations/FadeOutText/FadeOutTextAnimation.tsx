import { PropsWithChildren } from 'react';
import { TextStyle } from 'react-native';
import Animated, {
  FadeOut,
  FadeOutUp,
  FadeOutDown,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';

export type FadeOutDirection = 'up' | 'down' | 'left' | 'right' | 'default';

interface FadeOutTextAnimationProps extends PropsWithChildren {
  direction?: FadeOutDirection;
  delay?: number;
  style?: TextStyle;
  useSpring?: boolean;
}

const fadeOutMap = {
  up: FadeOutUp,
  down: FadeOutDown,
  left: FadeOutLeft,
  right: FadeOutRight,
  default: FadeOut,
};

export const FadeOutTextAnimation = ({
  direction = 'default',
  delay = 0,
  children,
  style,
  useSpring = true,
}: FadeOutTextAnimationProps) => {
  const Animation = fadeOutMap[direction];
  const exiting = useSpring ? Animation.delay(delay).springify() : Animation.delay(delay);
  return (
    <Animated.Text exiting={exiting} style={style}>
      {children}
    </Animated.Text>
  );
};
