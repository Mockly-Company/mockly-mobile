import React from 'react';
import { TouchableOpacity } from 'react-native';
import { tw, Text } from '@mockly/design-system';

type OnboardingLoginButtonProps = {
  onPress: () => void;
};

export const OnboardingLoginButton: React.FC<OnboardingLoginButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity style={tw`absolute top-15 right-6`} onPress={onPress}>
      <Text variant="caption" weight="semibold" color="primary">
        로그인
      </Text>
    </TouchableOpacity>
  );
};
