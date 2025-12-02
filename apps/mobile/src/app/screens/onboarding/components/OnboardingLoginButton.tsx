import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { tw } from '@mockly/design-system';

type OnboardingLoginButtonProps = {
  onPress: () => void;
};

export const OnboardingLoginButton: React.FC<OnboardingLoginButtonProps> = ({
  onPress,
}) => {
  const styles = {
    container: tw`absolute top-15 right-6`,
    text: tw`text-primary dark:text-primary-dark font-semibold text-sm`,
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>로그인</Text>
    </TouchableOpacity>
  );
};
