import React, { ReactNode } from 'react';
import { Alert, PressableProps } from 'react-native';
import { useUserProfile } from '@features/user/hooks';
import { useNavigation } from '@react-navigation/native';

interface WithPhoneVerificationProps {
  children: ReactNode;
  /**
   * 인증이 필요할 때 표시할 메시지
   * @default "이 기능을 사용하려면 휴대폰 인증이 필요합니다."
   */
  message?: string;
  /**
   * 인증 실패 시 Alert 대신 커스텀 핸들러 사용
   */
  onUnverified?: () => void;
  /**
   * 자식 컴포넌트의 onPress를 가로챌지 여부
   * @default true
   */
  interceptPress?: boolean;
}

export function WithPhoneVerification({
  children,
  message = '이 기능을 사용하려면 휴대폰 인증이 필요합니다.',
  onUnverified,
  interceptPress = true,
}: WithPhoneVerificationProps) {
  const { isPhoneVerified } = useUserProfile();
  const navigation = useNavigation();

  const handleUnverified = () => {
    if (onUnverified) {
      onUnverified();
      return;
    }

    Alert.alert('휴대폰 인증 필요', message, [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '인증하기',
        onPress: () => {
          navigation.navigate('OTPRequest');
        },
      },
    ]);
  };

  // 이미 인증된 경우 그대로 렌더링
  if (isPhoneVerified) {
    return <>{children}</>;
  }

  // 인증되지 않은 경우
  if (!interceptPress) {
    // onPress를 가로채지 않고 그냥 렌더링 (부모가 직접 처리)
    return <>{children}</>;
  }
  if (React.isValidElement<PressableProps>(children)) {
    return React.cloneElement(children, {
      onPress: handleUnverified,
    });
  }

  // onPress를 가로채서 인증 확인
  return children;
}

export function usePhoneVerification() {
  const { isPhoneVerified } = useUserProfile();
  const navigation = useNavigation();

  const requirePhoneVerification = (
    message: string = '이 기능을 사용하려면 휴대폰 인증이 필요합니다.',
  ): boolean => {
    if (isPhoneVerified) {
      return true;
    }

    Alert.alert('휴대폰 인증 필요', message, [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '인증하기',
        onPress: () => {
          navigation.navigate('OTPRequest');
        },
      },
    ]);

    return false;
  };

  const navigateToPhoneVerification = () => {
    navigation.navigate('OTPRequest');
  };

  return {
    isPhoneVerified,
    requirePhoneVerification,
    navigateToPhoneVerification,
  };
}
