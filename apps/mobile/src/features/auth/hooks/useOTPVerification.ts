import { useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import api from '@mockly/api';
import {
  OTPSendErrorCode,
  OTPVerifyErrorCode,
  getOTPErrorMessage,
  extractRemainingAttempts,
} from '@mockly/domain';
import { deviceInfo } from '@libs/deviceInfo';
import { useProfileStore } from '@features/user';
import { AppError } from '@errors/AppError';

interface UseOTPVerificationOptions {
  onOTPSent?: (expiresIn: number, canResendAfter: number) => void;
  onVerifySuccess?: () => void;
  onExpired?: () => void;
}

export function useOTPVerification({
  onOTPSent,
  onVerifySuccess,
  onExpired,
}: UseOTPVerificationOptions = {}) {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
    null,
  );
  const verifyPhone = useProfileStore(state => state.verifyPhone);
  // OTP 전송 Mutation
  const { mutateAsync: sendOTP, isPending: isSending } = useMutation({
    mutationFn: api.auth.postOTPMessage,
    onSuccess: res => {
      onOTPSent?.(res.expiresIn, res.canResendAfter);
      setRemainingAttempts(null);
      setErrorMessage('');
    },
    onError: error => {
      if (AppError.isApiError(error)) {
        const errorCode = error.serverCode as OTPSendErrorCode;
        const message = error.message || '';
        setErrorMessage(getOTPErrorMessage(errorCode, message));
      } else {
        setErrorMessage('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });

  // OTP 검증 Mutation
  const { mutateAsync: verifyOTP, isPending: isVerifying } = useMutation({
    mutationFn: api.auth.postOTPVerification,
    onSuccess: () => {
      Alert.alert('인증 완료', '휴대폰 인증이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            verifyPhone(true);
            onVerifySuccess?.();
            navigation.navigate('MainTabs', { screen: 'Home' });
          },
        },
      ]);
    },
    onError: error => {
      if (AppError.isApiError(error)) {
        const errorCode = error.serverCode;
        const errorMessage = error.message || '';
        switch (errorCode) {
          case OTPVerifyErrorCode.INVALID_CODE: {
            const remaining = extractRemainingAttempts(errorMessage);
            setRemainingAttempts(remaining);
            break;
          }
          case OTPVerifyErrorCode.CODE_EXPIRED:
            onExpired?.();
            break;
        }
        setErrorMessage(errorMessage);
      } else {
        console.error('Unexpected error during OTP verification:', error);
        setErrorMessage('인증에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });

  const handleSendOTP = async (phoneNumber: string) => {
    await sendOTP({ phoneNumber });
  };

  const handleVerifyOTP = async (phoneNumber: string, code: string) => {
    const deviceId = deviceInfo.getDevice();
    await verifyOTP({ phoneNumber, code, deviceId });
  };

  const clearError = () => setErrorMessage('');

  return {
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    isSending,
    isVerifying,
    errorMessage,
    remainingAttempts,
    clearError,
  };
}
