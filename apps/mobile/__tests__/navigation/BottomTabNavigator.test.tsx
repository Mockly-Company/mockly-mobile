/**
 * 5개 탭 간 네비게이션 테스트
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from '@app/navigation/BottomTabNavigator';

const renderNavigator = () => {
  return render(
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>,
  );
};

describe('BottomTabNavigator - 5개 탭 네비게이션', () => {
  describe('탭 구성', () => {
    it('5개의 탭이 모두 렌더링되어야 함', () => {
      renderNavigator();

      expect(screen.getByTestId('tab-home')).toBeTruthy();
      expect(screen.getByTestId('tab-local-interview')).toBeTruthy();
      expect(screen.getByTestId('tab-interview')).toBeTruthy();
      expect(screen.getByTestId('tab-chat')).toBeTruthy();
      expect(screen.getByTestId('tab-mypage')).toBeTruthy();
    });

    it('각 탭에 접근성 레이블이 설정되어 있어야 함', () => {
      renderNavigator();

      expect(screen.getByLabelText('홈 화면으로 이동')).toBeTruthy();
      expect(screen.getByLabelText('동네면접 화면으로 이동')).toBeTruthy();
      expect(screen.getByLabelText('면접 화면으로 이동')).toBeTruthy();
      expect(screen.getByLabelText('채팅 화면으로 이동')).toBeTruthy();
      expect(screen.getByLabelText('마이페이지 화면으로 이동')).toBeTruthy();
    });
  });

  describe('초기 화면', () => {
    it('기본적으로 Home 화면이 표시되어야 함', () => {
      renderNavigator();

      expect(screen.getByTestId('home-screen')).toBeTruthy();
    });
  });

  describe('탭 전환', () => {
    it('채팅 탭을 누르면 Chat 화면으로 전환되어야 함', async () => {
      renderNavigator();

      fireEvent.press(screen.getByTestId('tab-chat'));

      await waitFor(() => {
        expect(screen.getByTestId('chat-screen')).toBeTruthy();
      });
    });

    it('마이페이지 탭을 누르면 MyPage 화면으로 전환되어야 함', async () => {
      renderNavigator();

      fireEvent.press(screen.getByTestId('tab-mypage'));

      await waitFor(() => {
        expect(screen.getByText('Google로 로그인')).toBeTruthy();
      });
    });

    it('동네면접 탭을 누르면 LocalInterview 화면으로 전환되어야 함', async () => {
      renderNavigator();

      fireEvent.press(screen.getByTestId('tab-local-interview'));

      await waitFor(() => {
        expect(screen.getByTestId('local-interview-screen')).toBeTruthy();
      });
    });

    it('면접 탭을 누르면 Interview 화면으로 전환되어야 함', async () => {
      renderNavigator();

      fireEvent.press(screen.getByTestId('tab-interview'));

      await waitFor(() => {
        expect(screen.getByTestId('interview-screen')).toBeTruthy();
      });
    });

    it('탭 간 여러 번 전환해도 정상 작동해야 함', async () => {
      renderNavigator();

      // Home → Chat
      fireEvent.press(screen.getByTestId('tab-chat'));
      await waitFor(() => {
        expect(screen.getByTestId('chat-screen')).toBeTruthy();
      });

      // Chat → MyPage
      fireEvent.press(screen.getByTestId('tab-mypage'));
      await waitFor(() => {
        expect(screen.getByText('Google로 로그인')).toBeTruthy();
      });

      // MyPage → Home
      fireEvent.press(screen.getByTestId('tab-home'));
      await waitFor(() => {
        expect(screen.getByTestId('home-screen')).toBeTruthy();
      });
    });
  });
});
