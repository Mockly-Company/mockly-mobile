import React from 'react';
import { Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Button, tw } from '@mockly/design-system';
import { FadeInUpAnimation } from '@shared/components/animations/FadeInUpAnimation';

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

  const textStyle = useAnimatedStyle(() => ({
    display: isVisible.value ? 'none' : 'flex',
  }));

  return (
    <FadeInUpAnimation delay={400} style={styles.container}>
      <Animated.View style={buttonStyle}>
        <Button size="medium" style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>오늘부터 면접 연습하기</Text>
        </Button>
      </Animated.View>
      <Animated.Text style={[styles.tapToContinue, textStyle]}>
        탭해서 계속하기
      </Animated.Text>
    </FadeInUpAnimation>
  );
};

const styles = {
  container: tw`absolute bottom-12 left-6 right-6`,
  button: tw`w-full bg-primary dark:bg-primary-dark shadow-xl`,
  buttonText: tw`text-white dark:text-zinc-900 font-bold text-lg`,
  tapToContinue: tw`text-center text-zinc-500 dark:text-zinc-400 text-sm font-medium`,
};
