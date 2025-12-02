import { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface FadeInUpAnimationProps extends PropsWithChildren {
  delay?: number;
  style?: ViewStyle;
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
