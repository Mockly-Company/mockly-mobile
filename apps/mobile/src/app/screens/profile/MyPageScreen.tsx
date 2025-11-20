import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, tw } from '@mockly/design-system';
import { GoogleLoginButton } from '@app/components/ui/GoogleLoginButton';
import { useAuth } from '@features/auth/hooks';
import { capitalize } from '@shared/utils/stringUtils';
const containerStyle = tw`flex-1 justify-center items-center bg-white p-5`;
const profileContainerStyle = tw`items-center mb-8`;
const profileImageStyle = tw`w-25 h-25 rounded-full mb-4`;
const nameStyle = tw`text-2xl font-bold mb-2 text-black`;
const emailStyle = tw`text-base text-gray-600 mb-1`;
const providerStyle = tw`text-sm text-gray-400`;
const logoutButtonStyle = tw`bg-red-500 px-8 py-3 rounded-lg`;
const logoutButtonTextStyle = tw`text-white text-base font-semibold`;

export const MyPageScreen = () => {
  const { user, isLoading, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      // TODO: TOAST 공통 컴포넌트 개발시 수정
      Alert.alert(
        '로그아웃 실패',
        '로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.',
        [{ text: '확인' }],
      );
      console.error('로그아웃 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={containerStyle}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          testID="activity-indicator"
        />
      </View>
    );
  }

  if (user) {
    // 로그인된 상태
    return (
      <View style={containerStyle}>
        <View style={profileContainerStyle}>
          {user.photo && (
            <Image source={{ uri: user.photo }} style={profileImageStyle} />
          )}
          <Text style={nameStyle}>{user.name || '이름 없음'}</Text>
          <Text style={emailStyle}>{user.email}</Text>
          <Text style={providerStyle}>
            {capitalize(user.provider)}
            로그인
          </Text>
        </View>
        <TouchableOpacity style={logoutButtonStyle} onPress={handleLogout}>
          <Text style={logoutButtonTextStyle}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 로그인 안된 상태
  return (
    <View style={containerStyle}>
      <GoogleLoginButton />
    </View>
  );
};
