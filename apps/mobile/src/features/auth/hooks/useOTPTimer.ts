import { useState, useEffect, useCallback } from 'react';

export function useOTPTimer() {
  const [expireTime, setExpireTime] = useTimer();
  const [resendTime, setResendTime] = useTimer();

  const startTimer = useCallback(
    (expiresInSeconds: number, canResendAfterSeconds: number) => {
      setExpireTime(expiresInSeconds);
      setResendTime(canResendAfterSeconds);
    },
    [setExpireTime, setResendTime],
  );

  const resetTimer = useCallback(() => {
    setExpireTime(0);
    setResendTime(0);
  }, [setExpireTime, setResendTime]);

  return {
    expiresIn: expireTime,
    canResendAfter: resendTime,
    isExpired: expireTime <= 0,
    startTimer,
    resetTimer,
  };
}

function useTimer() {
  const [seconds, setSeconds] = useState(0);

  const isCounting = seconds > 0;
  useEffect(() => {
    if (!isCounting) return;

    const timer = setInterval(() => {
      setSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isCounting]);

  return [seconds, setSeconds] as const;
}
