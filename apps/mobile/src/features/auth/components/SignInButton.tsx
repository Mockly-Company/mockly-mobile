import { ActivityIndicator, Image, View } from 'react-native';
import { Button, colors, tw, Text } from '@mockly/design-system';
import { useAuth } from '@features/auth/hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { toast } from '@shared/utils/toast';
import { AppError } from '@shared/errors';
import { AuthProvider } from '@features/auth/types';
import { capitalize } from '@shared/utils/stringUtils';
import { useProfileStore } from '@features/user';
import { user } from '@mockly/api';

type SignInButtonProps = {
  provider: AuthProvider;
};

// TODO: 각 imageSource를 로컬 에셋으로 변경
const providerConfig: Record<
  AuthProvider,
  {
    imageSource: { uri: string };
    backgroundColor: string;
    borderColor: string;
    textStyle: string;
    imageTintColor?: string;
    indicatorColor: string;
  }
> = {
  google: {
    imageSource: { uri: 'https://img.clerk.com/static/google.png?width=160' },
    backgroundColor: 'bg-surface dark:bg-surface',
    borderColor: 'border-gray-300',
    textStyle: 'text-text',
    indicatorColor: colors.primary,
  },
  apple: {
    imageSource: { uri: 'https://img.clerk.com/static/apple.png?width=160' },
    backgroundColor: 'bg-black',
    borderColor: 'border-black dark:border-gray-700',
    textStyle: 'text-white',
    imageTintColor: '#ffffff',
    indicatorColor: '#ffffff',
  },
  naver: {
    imageSource: {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Naver_Logotype.svg',
    },
    backgroundColor: 'bg-[#03C75A]',
    borderColor: 'border-[#03C75A]',
    textStyle: 'text-white',
    indicatorColor: '#ffffff',
  },
  kakao: {
    imageSource: {
      uri: 'https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/service/kakaoaccount/logos/kakaoaccount_logo_220x80.png',
    },
    backgroundColor: 'bg-[#FEE500]',
    borderColor: 'border-[#FEE500]',
    textStyle: 'text-[#191919]',
    indicatorColor: '#191919',
  },
  github: {
    imageSource: { uri: 'https://img.clerk.com/static/github.png?width=160' },
    backgroundColor: 'bg-[#24292e]',
    borderColor: 'border-white',
    textStyle: 'text-white',
    imageTintColor: '#ffffff',
    indicatorColor: '#ffffff',
  },
};

export const SignInButton = ({ provider }: SignInButtonProps) => {
  const { signIn, isLoading, error, clearError } = useAuth();
  const { initialize } = useProfileStore();
  const { showBoundary } = useErrorBoundary();
  const config = providerConfig[provider];

  // Third Party 로그인은 컴포넌트 언마운트 시켜서 컴포넌트 상태관리 에러 발생. 그래서 별도로 에러 처리!!! 절대 함부로 수정 X
  useEffect(() => {
    if (!error) return;
    if (AppError.isNotBoundaryError(error)) {
      clearError();
      return;
    }
    showBoundary(error);
  }, [error, clearError, showBoundary]);

  const handleLogin = useCallback(async () => {
    await signIn(provider)
      .then(async userName => {
        const isUserCanceled = userName === null;
        if (isUserCanceled) return;
        const profile = await user.getUserProfile();
        initialize({ ...profile.user, provider }, profile.subscription);
        toast.success(`${provider} 로그인 성공`, `${userName}님 환영합니다!`);
      })
      .catch(err => {
        toast.error('로그인 실패', err.message || '다시 시도해주세요.');
      });
  }, [signIn, provider, initialize]);

  const buttonStyle = useMemo(
    () =>
      tw`${config.backgroundColor} ${config.borderColor} border rounded-lg px-6 py-3 shadow-sm`,
    [config],
  );
  const textStyle = useMemo(
    () => tw`${config.textStyle} text-base font-semibold`,
    [config],
  );

  return (
    <Button
      size="small"
      style={buttonStyle}
      onPress={handleLogin}
      disabled={isLoading}
      testID={`${provider}-login-button`}
      accessible={true}
      accessibilityLabel={`${capitalize(provider)}로 로그인`}
      accessibilityHint="탭하여 로그인 절차를 시작합니다"
      accessibilityRole="button"
    >
      <View style={tw`flex-row items-center justify-center w-full`}>
        <View style={tw`absolute left-0`}>
          <Image
            source={config.imageSource}
            style={tw`w-5 h-5`}
            tintColor={config.imageTintColor}
          />
        </View>
        <View style={tw`items-center`}>
          {isLoading ? (
            <ActivityIndicator size="small" color={config.indicatorColor} />
          ) : (
            <Text variant="body" weight="semibold" style={textStyle}>
              {capitalize(provider)}로 계속하기
            </Text>
          )}
        </View>
      </View>
    </Button>
  );
};
