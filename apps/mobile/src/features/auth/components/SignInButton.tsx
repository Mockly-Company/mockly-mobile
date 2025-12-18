import { ActivityIndicator, Image, View } from 'react-native';
import { Button, colors, tw, Text } from '@mockly/design-system';
import { useSignIn } from '@features/auth/hooks';
import { useCallback, useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { toast } from '@shared/utils/toast';
import { AppError } from '@shared/errors';
import { AuthProvider } from '@features/auth/types';
import { capitalize } from '@shared/utils/stringUtils';

type SignInButtonProps = {
  provider: AuthProvider;
};

export const SignInButton = ({ provider }: SignInButtonProps) => {
  const { signIn, isPending, error, clearError } = useSignIn();

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
    const userName = await signIn(provider).catch(err => {
      toast.error('로그인 실패', err.message || '다시 시도해주세요.');
    });
    if (!userName) return;
    toast.success(`${provider} 로그인 성공`, `${userName}님 환영합니다!`);
  }, [signIn, provider]);

  return (
    <Button
      size="small"
      style={tw`${config.backgroundColor} ${config.borderColor} border rounded-lg px-6 py-3 shadow-sm`}
      onPress={handleLogin}
      disabled={isPending}
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
          {isPending ? (
            <ActivityIndicator size="small" color={config.indicatorColor} />
          ) : (
            <Text
              variant="body"
              weight="semibold"
              style={tw`${config.textStyle} text-base font-semibold`}
            >
              {capitalize(provider)}로 계속하기
            </Text>
          )}
        </View>
      </View>
    </Button>
  );
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
