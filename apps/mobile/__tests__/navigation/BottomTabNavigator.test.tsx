/**
 * 5개 탭 구성 테스트
 *
 * 참고: 화면 전환 로직은 React Navigation의 책임이므로 테스트하지 않습니다.
 * 대신 탭 구성과 접근성만 검증합니다.
 */

import { render, screen, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from '@app/navigation/BottomTabNavigator';

// useAuth 훅 모킹
jest.mock('@features/auth/hooks', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
    refreshUser: jest.fn(),
  }),
}));

// useInterviewStore 훅 모킹
jest.mock('@features/interview/store', () => ({
  useInterviewStore: () => ({
    streak: 12,
    recentLogs: [
      {
        id: '1',
        title: 'Frontend Developer Interview',
        date: '2023-10-25',
        score: 85,
        durationMin: 35,
      },
      {
        id: '2',
        title: 'System Design Interview',
        date: '2023-10-24',
        score: 72,
        durationMin: 50,
      },
    ],
    setStreak: jest.fn(),
    addLog: jest.fn(),
  }),
}));

const renderNavigator = () => {
  return render(
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>,
  );
};

describe('BottomTabNavigator - 5개 탭 구성', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('탭 구성', () => {
    it('5개의 탭이 모두 렌더링되어야 함', async () => {
      renderNavigator();
      await act(async () => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('tab-home')).toBeTruthy();
      expect(screen.getByTestId('tab-local-interview')).toBeTruthy();
      expect(screen.getByTestId('tab-interview')).toBeTruthy();
      expect(screen.getByTestId('tab-chat')).toBeTruthy();
      expect(screen.getByTestId('tab-mypage')).toBeTruthy();
    });

    it('각 탭에 접근성 레이블이 설정되어 있어야 함', async () => {
      renderNavigator();
      await act(async () => {
        jest.runAllTimers();
      });

      expect(screen.getByLabelText('홈 화면으로 이동')).toBeTruthy();
      expect(screen.getByLabelText('동네면접 화면으로 이동')).toBeTruthy();
      expect(screen.getByLabelText('면접 화면으로 이동')).toBeTruthy();
      expect(screen.getByLabelText('채팅 화면으로 이동')).toBeTruthy();
      expect(screen.getByLabelText('마이페이지 화면으로 이동')).toBeTruthy();
    });
  });
});
