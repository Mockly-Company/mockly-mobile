import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { tw } from '@mockly/design-system';

type OnboardingLoginButtonProps = {
  onPress: () => void;
};

export const OnboardingLoginButton: React.FC<OnboardingLoginButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity style={tw`absolute top-15 right-6`} onPress={onPress}>
      <Text
        style={tw`text-primary dark:text-primary-dark font-semibold text-sm`}
      >
        로그인
      </Text>
    </TouchableOpacity>
  );
};
