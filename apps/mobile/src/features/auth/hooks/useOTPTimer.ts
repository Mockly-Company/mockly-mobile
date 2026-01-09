import { useState, useEffect, useCallback } from 'react';

interface UseOTPTimerReturn {
  expiresIn: number;
  canResendAfter: number;
  isExpired: boolean;
  startTimer: (expiresInSeconds: number, canResendAfterSeconds: number) => void;
  resetTimer: () => void;
}

export function useOTPTimer(): UseOTPTimerReturn {
  const [expiresIn, setExpiresIn] = useState(0);
  const [canResendAfter, setCanResendAfter] = useState(0);

  // OTP 만료 타이머
  useEffect(() => {
    if (expiresIn <= 0) return;

    const timer = setInterval(() => {
      setExpiresIn(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresIn]);

  // 재전송 대기 타이머
  useEffect(() => {
    if (canResendAfter <= 0) return;

    const timer = setInterval(() => {
      setCanResendAfter(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [canResendAfter]);

  const startTimer = useCallback(
    (expiresInSeconds: number, canResendAfterSeconds: number) => {
      setExpiresIn(expiresInSeconds);
      setCanResendAfter(canResendAfterSeconds);
    },
    [],
  );

  const resetTimer = useCallback(() => {
    setExpiresIn(0);
    setCanResendAfter(0);
  }, []);

  const isExpired = expiresIn === 0;

  return {
    expiresIn,
    canResendAfter,
    isExpired,
    startTimer,
    resetTimer,
  };
}
