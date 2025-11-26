import { ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { colors, tw } from '@mockly/design-system';
import { useAuth } from '@features/auth/hooks';
import { useCallback, useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { toast } from '@shared/utils/toast';
import { AppError } from '@shared/errors';

const buttonStyle = tw`bg-white border border-gray-300 rounded-lg px-6 py-3 flex-row items-center justify-center shadow-sm`;
const buttonTextStyle = tw`text-gray-700 text-base font-semibold ml-3`;

export const GoogleLoginButton = () => {
  const { signIn, isLoading, error, clearError } = useAuth();
  const { showBoundary } = useErrorBoundary();

  // Third Party 로그인은 컴포넌트 언마운트 시켜서 컴포넌트 상태관리 에러 발생. 그래서 별도로 에러 처리!!! 절대 함부로 수정 X
  useEffect(() => {
    if (!error) return;
    if (AppError.isNotBoundaryError(error)) {
      clearError();
      return;
    }
    showBoundary(error);
  }, [error, clearError, showBoundary]);

  const handleGoogleLogin = useCallback(async () => {
    await signIn('google')
      .then(userName => {
        const isUserCanceled = userName === null;
        if (isUserCanceled) return;
        toast.success('로그인 성공', `${userName}님 환영합니다!`);
      })
      .catch(err => {
        toast.error('로그인 실패', err.message || '다시 시도해주세요.');
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
