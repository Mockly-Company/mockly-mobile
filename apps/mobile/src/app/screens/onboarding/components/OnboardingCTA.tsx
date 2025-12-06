import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Button, tw } from '@mockly/design-system';

type OnboardingCTAProps = {
  isVisible: SharedValue<boolean>;
  onPress: () => void;
};

export const OnboardingCTA: React.FC<OnboardingCTAProps> = ({
  isVisible,
  onPress,
}) => {
  const buttonStyle = useAnimatedStyle(() => ({
    display: isVisible.value ? 'flex' : 'none',
  }));

  return (
    <Animated.View style={buttonStyle}>
      <Button
        size="medium"
        style={tw`w-full bg-primary dark:bg-primary-dark shadow-xl`}
        onPress={onPress}
      >
        <Button.Text
          style={tw`text-white dark:text-zinc-900 font-bold text-lg`}
        >
          오늘부터 면접 연습하기
        </Button.Text>
      </Button>
    </Animated.View>
  );
};
