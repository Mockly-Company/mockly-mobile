import { ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { colors, tw } from '@mockly/design-system';
import { useAuth } from '@features/auth/hooks';

const buttonStyle = tw`bg-white border border-gray-300 rounded-lg px-6 py-3 flex-row items-center justify-center shadow-sm`;
const buttonTextStyle = tw`text-gray-700 text-base font-semibold ml-3`;

export const GoogleLoginButton = () => {
  const { signIn, isLoading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signIn('google');
    } catch (error) {
      console.error('Google 로그인 실패:', error);
    }
  };

  return isLoading ? (
    <ActivityIndicator size="small" color={colors.primary} />
  ) : (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handleGoogleLogin}
      disabled={isLoading}
      testID="google-login-button"
    >
      <Text style={buttonTextStyle}>Google로 로그인</Text>
    </TouchableOpacity>
  );
};
