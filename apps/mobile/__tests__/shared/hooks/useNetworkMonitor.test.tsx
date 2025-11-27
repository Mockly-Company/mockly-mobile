import { renderHook } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNetworkMonitor } from '@shared/hooks/useNetworkMonitor';
import { toast } from '@shared/utils/toast';

jest.mock('@react-native-community/netinfo');
jest.mock('@shared/utils/toast');

type NetInfoCallback = (state: { isConnected: boolean | null }) => void;

describe('useNetworkMonitor', () => {
  let netInfoListener: NetInfoCallback | null = null;
  let unsubscribeMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    netInfoListener = null;

    unsubscribeMock = jest.fn();

    (NetInfo.addEventListener as jest.Mock).mockImplementation(
      (callback: NetInfoCallback) => {
        netInfoListener = callback;
        return unsubscribeMock;
      },
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('초기화', () => {
    it('NetInfo 이벤트 리스너를 등록해야 함', () => {
      renderHook(() => useNetworkMonitor());

      expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);
      expect(NetInfo.addEventListener).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });

    it('초기 연결 상태에서는 Toast를 표시하지 않아야 함', () => {
      renderHook(() => useNetworkMonitor());

      netInfoListener?.({ isConnected: true });

      expect(toast.success).not.toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('언마운트 시 이벤트 리스너를 해제해야 함', () => {
      const { unmount } = renderHook(() => useNetworkMonitor());

      unmount();

      expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('네트워크 연결 상태 변화', () => {
    it('연결됨 → 끊김 시 에러 Toast를 표시해야 함', () => {
      renderHook(() => useNetworkMonitor());

      // 초기 연결 상태 설정
      netInfoListener?.({ isConnected: true });
      expect(toast.error).not.toHaveBeenCalled();

      // 연결 끊김
      netInfoListener?.({ isConnected: false });

      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith(
        '네트워크 연결 끊김',
        '인터넷 연결을 확인해주세요.',
        'bottom',
      );
    });

    it('끊김 → 연결됨 시 성공 Toast를 표시해야 함', () => {
      renderHook(() => useNetworkMonitor());

      // 초기 연결 끊김 상태 설정
      netInfoListener?.({ isConnected: false });
      expect(toast.success).not.toHaveBeenCalled();

      // 연결됨
      netInfoListener?.({ isConnected: true });

      expect(toast.success).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith(
        '네트워크 연결됨',
        '인터넷에 다시 연결되었습니다.',
        'bottom',
      );
    });

    it('동일한 상태가 반복되면 Toast를 표시하지 않아야 함', () => {
      renderHook(() => useNetworkMonitor());

      // 초기 연결 상태
      netInfoListener?.({ isConnected: true });

      // 동일한 상태 반복
      netInfoListener?.({ isConnected: true });
      netInfoListener?.({ isConnected: true });

      expect(toast.success).not.toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('Cooldown 메커니즘', () => {
    it('2초 이내 반복 변화는 Toast를 표시하지 않아야 함', () => {
      renderHook(() => useNetworkMonitor());

      // 초기 연결 상태
      netInfoListener?.({ isConnected: true });

      // 첫 번째 변화: 연결 끊김
      netInfoListener?.({ isConnected: false });
      expect(toast.error).toHaveBeenCalledTimes(1);

      // 1초 후 다시 연결 (cooldown 이내)
      jest.advanceTimersByTime(1000);
      netInfoListener?.({ isConnected: true });
      expect(toast.success).not.toHaveBeenCalled();
    });

    it('2초 이후 변화는 Toast를 표시해야 함', () => {
      renderHook(() => useNetworkMonitor());

      // 초기 연결 상태
      netInfoListener?.({ isConnected: true });

      // 첫 번째 변화: 연결 끊김
      netInfoListener?.({ isConnected: false });
      expect(toast.error).toHaveBeenCalledTimes(1);

      // 2초 경과 후 다시 연결
      jest.advanceTimersByTime(2001);
      netInfoListener?.({ isConnected: true });

      expect(toast.success).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('isConnected가 null인 경우 false로 처리해야 함', () => {
      renderHook(() => useNetworkMonitor());

      // 초기 연결 상태
      netInfoListener?.({ isConnected: true });

      // null로 변경 (false로 처리됨)
      netInfoListener?.({ isConnected: null });

      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith(
        '네트워크 연결 끊김',
        '인터넷 연결을 확인해주세요.',
        'bottom',
      );
    });

    it('초기 상태가 null인 경우에도 Toast를 표시하지 않아야 함', () => {
      renderHook(() => useNetworkMonitor());

      netInfoListener?.({ isConnected: null });

      expect(toast.success).not.toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('빠른 연속 변화에서 cooldown이 정확히 동작해야 함', () => {
      renderHook(() => useNetworkMonitor());

      // 초기 연결
      netInfoListener?.({ isConnected: true });

      // 연결 끊김 (Toast 표시, lastNotificationTime 업데이트)
      netInfoListener?.({ isConnected: false });
      expect(toast.error).toHaveBeenCalledTimes(1);

      // 2초 이상 경과 후 다시 연결됨 (Toast 표시)
      jest.advanceTimersByTime(2001);
      netInfoListener?.({ isConnected: true });
      expect(toast.success).toHaveBeenCalledTimes(1);

      // 다시 2초 이상 경과 후 연결 끊김 (Toast 표시)
      jest.advanceTimersByTime(2001);
      netInfoListener?.({ isConnected: false });
      expect(toast.error).toHaveBeenCalledTimes(2);
    });
  });
});
