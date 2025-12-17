import { View } from 'react-native';
import { tw, Text } from '@mockly/design-system';
import { useLoggedInAuth } from '@features/auth/hooks';
import { capitalize } from '@shared/utils/stringUtils';
import { LogoutButton } from '@features/auth/components/LogoutButton';

export const MyPageScreen = () => {
  const { user } = useLoggedInAuth();

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <View style={tw`items-center mb-8`}>
        <Text variant="h2" color="text" style={tw`mb-2`}>
          {user.name || '이름 없음'}
        </Text>
        <Text variant="body" color="textSecondary" style={tw`mb-1`}>
          {user.email}
        </Text>
        <Text variant="caption" color="textSecondary">
          {capitalize(user.provider)} 로그인
        </Text>
      </View>
      <LogoutButton />
    </View>
  );
};
