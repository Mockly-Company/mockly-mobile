import { PropsWithChildren } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FadeInDownAnimationProps extends PropsWithChildren {
  delay?: number;
}

export const FadeInDownAnimation = ({
  delay = 0,
  children,
}: FadeInDownAnimationProps) => {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      {children}
    </Animated.View>
  );
};
