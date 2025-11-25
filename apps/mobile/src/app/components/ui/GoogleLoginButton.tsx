import { ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { colors, tw } from '@mockly/design-system';
import { useAuth } from '@features/auth/hooks';
import { useCallback, useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { showToast } from '@shared/utils/toast';

const buttonStyle = tw`bg-white border border-gray-300 rounded-lg px-6 py-3 flex-row items-center justify-center shadow-sm`;
const buttonTextStyle = tw`text-gray-700 text-base font-semibold ml-3`;

export const GoogleLoginButton = () => {
  const { signIn, isLoading, error, clearError } = useAuth();
  const { showBoundary } = useErrorBoundary();

  // Third Party 로그인은 컴포넌트 언마운트 시키기 때문에 별도 함수로 에러 처리!!! 절대 함부로 수정 X
  useEffect(() => {
    if (error) {
      clearError();
      showBoundary(error);
    }
  }, [error, clearError, showBoundary]);

  const handleGoogleLogin = useCallback(async () => {
    await signIn('google')
      .then(userName => {
        showToast.success('로그인 성공', `${userName}님 환영합니다!`);
      })
      .catch(() => {
        showToast.error('로그인 실패', '다시 시도해주세요.');
      });
  }, [signIn]);

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
