import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { toast } from '@shared/utils/toast';

/**
 * 네트워크 연결 상태를 모니터링하고 Toast로 알림
 */
export const useNetworkMonitor = () => {
  const previouslyConnected = useRef<boolean | null>(null);
  const lastNotificationTime = useRef<number>(0);
  const NOTIFICATION_COOLDOWN = 2000; // 2초

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state.isConnected ?? false;

      if (previouslyConnected.current === null) {
        previouslyConnected.current = isConnected;
        return;
      }

      const isNetworkConnectionChanged =
        previouslyConnected.current !== isConnected;
      const now = Date.now();
      const canNotify =
        now - lastNotificationTime.current > NOTIFICATION_COOLDOWN;

      if (isNetworkConnectionChanged && canNotify) {
        if (isConnected) {
          toast.success(
            '네트워크 연결됨',
            '인터넷에 다시 연결되었습니다.',
            'bottom',
          );
        } else {
          toast.error(
            '네트워크 연결 끊김',
            '인터넷 연결을 확인해주세요.',
            'bottom',
          );
        }
        previouslyConnected.current = isConnected;
        lastNotificationTime.current = now;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
