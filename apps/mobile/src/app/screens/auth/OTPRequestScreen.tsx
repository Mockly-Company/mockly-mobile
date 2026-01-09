import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { TouchableWithoutFeedbackProps, View } from 'react-native';
import { tw, Text, ScreenFooter, Input, Button } from '@mockly/design-system';
import { useOTPVerification } from '@features/auth/hooks/useOTPVerification';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhoneNumber } from '@mockly/domain';

export function OTPRequestScreen() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('010-');

  const { sendOTP, isSending, errorMessage } = useOTPVerification({
    onOTPSent: (expiresInSeconds, canResendAfterSeconds) => {
      navigation.navigate('OTPVerification', {
        phoneNumber,
        expiresIn: expiresInSeconds,
        canResendAfter: canResendAfterSeconds,
      });
    },
  });

  const isValidPhoneNumber = useMemo(() => {
    const result = PhoneNumber.schema.safeParse(phoneNumber);
    return result.success;
  }, [phoneNumber]);

  const handleSendOTP = useCallback(async () => {
    if (isValidPhoneNumber) return await sendOTP(phoneNumber);
  }, [isValidPhoneNumber, phoneNumber, sendOTP]);

  const handleChangePhoneNumber = (text: string) => {
    const formatted = PhoneNumber.format(text);
    // "010-" 이하로는 지워지지 않도록
    if (formatted.length <= 4) {
      setPhoneNumber('010-');
    } else {
      setPhoneNumber(formatted);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Header
        title="휴대전화 인증"
        subTitle="본인 확인을 위해 휴대전화 인증이 필요합니다."
      />
      <Content info="인증번호는 하루 최대 5회까지 전송 가능합니다.">
        <PhoneNumberInput
          value={phoneNumber}
          onChangeText={handleChangePhoneNumber}
          error={errorMessage}
          editable
          onSubmit={handleSendOTP}
        />
      </Content>

      <Footer>
        <SendOTPButton
          onPress={handleSendOTP}
          disabled={isSending || !isValidPhoneNumber}
          isLoading={isSending}
        />
      </Footer>
    </SafeAreaView>
  );
}

type HeaderProps = {
  title: string;
  subTitle: string;
};
const Header = ({ title, subTitle }: HeaderProps) => (
  <View style={tw`mb-10`}>
    <Text variant="h1" style={tw`mb-3 text-center`}>
      {title}
    </Text>
    <Text variant="body" color="secondary" style={tw`text-center`}>
      {subTitle}
    </Text>
  </View>
);

type PhoneInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  editable: boolean;
  error?: string;
};

const PhoneNumberInput = ({
  value,
  onChangeText,
  editable,
  error,
  onSubmit,
}: PhoneInputProps & { onSubmit?: () => void }) => {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder="010-1234-5678"
      keyboardType="phone-pad"
      maxLength={13}
      editable={editable}
      style={tw`mb-4`}
      error={error}
      variant="underlined"
      returnKeyType="done"
      onSubmitEditing={onSubmit}
    />
  );
};

// CTA 버튼
type SendOTPButtonProps = {
  onPress: TouchableWithoutFeedbackProps['onPress'];
  isLoading: boolean;
  disabled: boolean;
};

const SendOTPButton = ({
  onPress,
  isLoading,
  disabled,
}: SendOTPButtonProps) => {
  return (
    <Button onPress={onPress} disabled={disabled} variant="primary">
      <Button.Text style={tw`text-lg`}>
        {isLoading ? '전송중...' : '인증번호 전송'}
      </Button.Text>
    </Button>
  );
};

const Content = ({ children, info }: PropsWithChildren<{ info: string }>) => (
  <View style={tw`flex-1 px-6`}>
    {children}
    <Text variant="body" color="secondary" style={tw`mb-3`}>
      {info}
    </Text>
  </View>
);

const Footer = ({ children }: PropsWithChildren) => (
  <ScreenFooter withShadow>{children}</ScreenFooter>
);
