import { Style } from '@testing-library/react-native/build/matchers/to-have-style';
import { PropsWithChildren } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface FadeInUpAnimationProps extends PropsWithChildren {
  delay?: number;
  style?: Style;
}

export const FadeInUpAnimation = ({
  delay = 0,
  children,
  style,
}: FadeInUpAnimationProps) => {
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()} style={style}>
      {children}
    </Animated.View>
  );
};
