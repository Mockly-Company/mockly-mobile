import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { tw, Text, ScreenFooter, Button } from '@mockly/design-system';
import { useOTPTimer } from '@features/auth/hooks/useOTPTimer';
import { useOTPVerification } from '@features/auth/hooks/useOTPVerification';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OTPCodeSchema } from '@mockly/domain';
import { OTPCodeInput } from '@features/auth/components/OTPCodeInput';
import { NumPad } from '@features/auth/components/NumPad';

type RouteParams = {
  phoneNumber: string;
  expiresIn: number;
  canResendAfter: number;
};

export function OTPVerificationScreen() {
  const route = useRoute();
  const params = route.params as RouteParams;

  const {
    phoneNumber,
    expiresIn: initialExpiresIn,
    canResendAfter: initialCanResendAfter,
  } = params;
  const [code, setCode] = useState<string>('');

  const { expiresIn, canResendAfter, isExpired, startTimer, resetTimer } =
    useOTPTimer();

  const { sendOTP, verifyOTP, isSending, isVerifying, errorMessage } =
    useOTPVerification({
      onOTPSent: (expiresInSeconds, canResendAfterSeconds) => {
        startTimer(expiresInSeconds, canResendAfterSeconds);
      },
      onExpired: () => {
        resetTimer();
      },
    });

  // 처음 화면 진입 시 타이머 시작
  useEffect(() => {
    startTimer(initialExpiresIn, initialCanResendAfter);
  }, [startTimer, initialExpiresIn, initialCanResendAfter]);

  // 핸들러들
  const handleResendOTPMessage = async () => {
    await sendOTP(phoneNumber);
    setCode('');
  };

  const handleVerifyOTP = useCallback(
    async (otpCode: string) => {
      const result = OTPCodeSchema.safeParse(otpCode);
      if (result.success) {
        await verifyOTP(phoneNumber, otpCode).finally(() => {
          setCode('');
        });
        return;
      }
      setCode('');
    },
    [phoneNumber, verifyOTP],
  );

  const handleChangeCode = useCallback(
    (text: string) => {
      const newCode = text.replace(/\D/g, '');
      setCode(newCode);
      // 6자리가 모두 입력되면 자동으로 검증
      if (newCode.length === 6) {
        handleVerifyOTP(newCode);
      }
    },
    [handleVerifyOTP],
  );

  const handleNumPress = (num: string) => {
    if (code.length < 6) {
      handleChangeCode(code + num);
    }
  };

  const handleNumDelete = () => {
    handleChangeCode(code.slice(0, -1));
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Header
        title={`문자로 전송된\n인증번호를 입력해주세요.`}
        expiresIn={expiresIn}
      />

      <Content>
        {/* OTP Input */}
        <OTPInput
          value={code}
          onTextChange={handleChangeCode}
          disabled={isVerifying || isExpired}
          error={errorMessage}
        />
      </Content>

      <Footer>
        <ResendButton
          resendRemainingSeconds={canResendAfter}
          onPress={handleResendOTPMessage}
          isLoading={isSending}
        />
        <NumPad
          onPress={handleNumPress}
          onDelete={handleNumDelete}
          disabled={isVerifying || isExpired}
        />
      </Footer>
    </SafeAreaView>
  );
}
type HeaderProps = {
  title: string;
  expiresIn: number;
};

const Header = ({ title, expiresIn }: HeaderProps) => {
  return (
    <View style={tw`px-6 mb-8`}>
      <Text variant="h1">{title}</Text>
      <Text variant="body" color={expiresIn < 60 ? 'error' : 'textSecondary'}>
        남은 시간: {secondsTommss(expiresIn)}
      </Text>
    </View>
  );
};

function secondsTommss(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const Footer = ({ children }: PropsWithChildren) => (
  <ScreenFooter style={tw`flex gap-4`} withShadow>
    {children}
  </ScreenFooter>
);

type ResendButtonProps = {
  onPress: () => Promise<void>;
  isLoading: boolean;
  resendRemainingSeconds: number;
};

function ResendButton({
  onPress,
  isLoading,
  resendRemainingSeconds,
}: ResendButtonProps) {
  const canResend = resendRemainingSeconds > 0;
  if (canResend) {
    return (
      <Text
        variant="caption"
        color="textSecondary"
        style={tw`mt-2 text-center`}
      >
        인증번호 재전송 ({resendRemainingSeconds}초)
      </Text>
    );
  }

  return (
    <Button
      onPress={onPress}
      disabled={isLoading}
      variant="secondary"
      style={tw`bg-transparent p-0 text-center`}
    >
      <Button.Text style={tw`underline text-sm`}>
        {isLoading ? '전송중...' : '인증번호 재전송'}
      </Button.Text>
    </Button>
  );
}
type OTPInputProps = {
  value: string;
  onTextChange: (text: string) => void;
  disabled: boolean;
  error?: string;
};

const OTPInput = ({ value, onTextChange, disabled, error }: OTPInputProps) => {
  return (
    <>
      <OTPCodeInput
        value={value}
        onChange={onTextChange}
        length={6}
        disabled={disabled}
      />
      <Text
        variant="caption"
        color={error ? 'error' : 'textSecondary'}
        style={tw` mt-3 mb-3`}
      >
        {error ||
          '* 인증문자가 오지 않으면 수신차단 메시지 또는 스팸함을 확인해 주세요.'}
      </Text>
    </>
  );
};

const Content = ({ children }: PropsWithChildren) => {
  return <View style={tw`flex-1 mb-12 px-6`}>{children}</View>;
};
