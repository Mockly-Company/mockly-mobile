import { useState, useEffect } from 'react';

export function useOTPTimer() {
  const expires = useTimer();
  const resend = useTimer();

  return {
    expiresIn: expires.seconds,
    canResendAfter: resend.seconds,
    isExpired: expires.seconds === 0,
    startTimer: (expiresInSeconds: number, canResendAfterSeconds: number) => {
      expires.setSeconds(expiresInSeconds);
      resend.setSeconds(canResendAfterSeconds);
    },
    resetTimer: () => {
      expires.setSeconds(0);
      resend.setSeconds(0);
    },
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

  return { seconds, setSeconds };
}
