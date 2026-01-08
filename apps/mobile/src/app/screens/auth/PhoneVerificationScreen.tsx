import { View } from 'react-native';
import { tw, Text } from '@mockly/design-system';

export function PhoneVerificationScreen() {
  return (
    <View style={tw`flex-1 items-center justify-center p-4`}>
      <Text variant="h2">휴대전화 인증</Text>
      <Text variant="body" color="textSecondary" style={tw`mt-4 text-center`}>
        휴대전화 인증 기능은 현재 개발 중입니다.
      </Text>
    </View>
  );
}
