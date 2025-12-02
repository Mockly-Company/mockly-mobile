import { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FadeInDownAnimationProps extends PropsWithChildren {
  delay?: number;
  style?: ViewStyle;
}

export const FadeInDownAnimation = ({
  delay = 0,
  children,
  style,
}: FadeInDownAnimationProps) => {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={style}>
      {children}
    </Animated.View>
  );
};
