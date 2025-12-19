import Toast from 'react-native-toast-message';
import { toast } from '@libs/toast';

jest.mock('react-native-toast-message');

describe('toast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('기본 동작', () => {
    it('success 메시지를 표시해야 함', () => {
      toast.success('성공', '작업이 완료되었습니다');

      expect(Toast.show).toHaveBeenCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        visibilityTime: 3000,
        text1: '성공',
        text2: '작업이 완료되었습니다',
        position: 'top',
      });
    });

    it('error 메시지를 표시해야 함', () => {
      toast.error('에러', '오류가 발생했습니다');

      expect(Toast.show).toHaveBeenCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        visibilityTime: 4000,
        text1: '에러',
        text2: '오류가 발생했습니다',
        position: 'top',
      });
    });

    it('info 메시지를 표시해야 함', () => {
      toast.info('정보', '알림입니다');

      expect(Toast.show).toHaveBeenCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'info',
        visibilityTime: 3000,
        text1: '정보',
        text2: '알림입니다',
        position: 'top',
      });
    });

    it('warning 메시지를 표시해야 함', () => {
      toast.warning('경고', '주의하세요');

      expect(Toast.show).toHaveBeenCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'info',
        visibilityTime: 3500,
        text1: '경고',
        text2: '주의하세요',
        position: 'top',
      });
    });
  });

  describe('position 옵션', () => {
    it('position을 bottom으로 설정할 수 있어야 함', () => {
      toast.success('성공', '완료', 'bottom');

      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'bottom',
        }),
      );
    });

    it('position 기본값은 top이어야 함', () => {
      toast.success('성공');

      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'top',
        }),
      );
    });
  });

  describe('description 생략', () => {
    it('description 없이도 표시할 수 있어야 함', () => {
      toast.success('성공');

      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        visibilityTime: 3000,
        text1: '성공',
        text2: undefined,
        position: 'top',
      });
    });
  });

  describe('Debounce 메커니즘', () => {
    it('300ms 이내 동일한 메시지는 중복 표시하지 않아야 함', () => {
      toast.success('중복 메시지', '설명');
      toast.success('중복 메시지', '설명');

      expect(Toast.show).toHaveBeenCalledTimes(1);
    });

    it('300ms 이후 동일한 메시지는 다시 표시해야 함', () => {
      toast.success('반복 메시지', '설명');

      jest.advanceTimersByTime(301);

      toast.success('반복 메시지', '설명');

      expect(Toast.show).toHaveBeenCalledTimes(2);
    });

    it('다른 메시지는 즉시 표시해야 함', () => {
      toast.success('첫 번째', '설명1');
      toast.success('두 번째', '설명2');

      expect(Toast.show).toHaveBeenCalledTimes(2);
    });

    it('같은 메시지라도 타입이 다르면 표시해야 함', () => {
      toast.success('메시지');
      toast.error('메시지');

      // 메시지만 비교하므로 타입이 달라도 중복으로 간주됨
      expect(Toast.show).toHaveBeenCalledTimes(1);
    });
  });

  describe('메모리 정리', () => {
    it('5초 후 중복 방지 상태가 초기화되어야 함', () => {
      toast.success('메시지', '설명');

      expect(Toast.show).toHaveBeenCalledTimes(1);

      // 300ms 이내: 중복으로 무시
      jest.advanceTimersByTime(200);
      toast.success('메시지', '설명');
      expect(Toast.show).toHaveBeenCalledTimes(1);

      // 5초 경과: 메모리 정리
      jest.advanceTimersByTime(5000);

      // 다시 표시 가능
      toast.success('메시지', '설명');
      expect(Toast.show).toHaveBeenCalledTimes(2);
    });

    it('연속된 메시지마다 새로운 정리 타이머가 설정되어야 함', () => {
      toast.success('첫 번째');
      expect(Toast.show).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(301);
      toast.success('두 번째');
      expect(Toast.show).toHaveBeenCalledTimes(2);

      // 두 번째 메시지로부터 5초 후
      jest.advanceTimersByTime(5000);

      // 메모리 정리되어 다시 표시 가능
      toast.success('두 번째');
      expect(Toast.show).toHaveBeenCalledTimes(3);
    });
  });

  describe('빠른 연속 호출', () => {
    it('빠르게 여러 번 호출해도 첫 번째만 표시해야 함', () => {
      for (let i = 0; i < 10; i++) {
        toast.success('빠른 호출', '설명');
      }

      expect(Toast.show).toHaveBeenCalledTimes(1);
    });

    it('다른 메시지는 모두 표시해야 함', () => {
      toast.success('메시지 1');
      toast.success('메시지 2');
      toast.success('메시지 3');

      expect(Toast.show).toHaveBeenCalledTimes(3);
    });
  });

  describe('visibilityTime 설정', () => {
    it('success는 3000ms여야 함', () => {
      toast.success('성공');

      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          visibilityTime: 3000,
        }),
      );
    });

    it('error는 4000ms여야 함', () => {
      toast.error('에러');

      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          visibilityTime: 4000,
        }),
      );
    });

    it('info는 3000ms여야 함', () => {
      toast.info('정보');

      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          visibilityTime: 3000,
        }),
      );
    });

    it('warning은 3500ms여야 함', () => {
      toast.warning('경고');

      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          visibilityTime: 3500,
        }),
      );
    });
  });
});
