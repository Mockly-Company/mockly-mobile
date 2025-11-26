/**
 * 로그인 상태에 따른 MyPage 화면 전환 테스트
 */

import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import { MyPageScreen } from '@app/screens/profile/MyPageScreen';
import { useAuth } from '@features/auth/hooks';
import type { AuthUser } from '@features/auth/types';
import { ErrorBoundary } from 'react-error-boundary';
import React from 'react';

// useAuth 훅을 mock
jest.mock('@features/auth/hooks');

// 테스트용 ErrorBoundary 래퍼
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary fallback={<></>}>{children}</ErrorBoundary>
);

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockUser: AuthUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  photo: 'https://example.com/photo.jpg',
  provider: 'google',
};

describe('MyPageScreen - 실제 컴포넌트 렌더링 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  describe('로그인 안된 상태', () => {
    it('로그인하지 않았을 때 GoogleLoginButton을 표시해야 함', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        refreshUser: jest.fn(),
        error: null,
        clearError: jest.fn(),
        setError: jest.fn(),
      });

      render(
        <TestWrapper>
          <MyPageScreen />
        </TestWrapper>,
      );

      expect(screen.getByTestId('google-login-button')).toBeTruthy();
    });
  });

  describe('로그인된 상태', () => {
    it('로그인했을 때 사용자 정보를 표시해야 함', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
        signIn: jest.fn(),
        signOut: jest.fn(),
        refreshUser: jest.fn(),
        error: null,
        clearError: jest.fn(),
        setError: jest.fn(),
      });

      render(
        <TestWrapper>
          <MyPageScreen />
        </TestWrapper>,
      );

      expect(screen.getByText(mockUser.name ?? '에러')).toBeTruthy();
      expect(screen.getByText(mockUser.email)).toBeTruthy();
      expect(
        screen.getByText(new RegExp(`${mockUser.provider}`, 'gi')),
      ).toBeTruthy();
      expect(screen.getByText('로그아웃')).toBeTruthy();
    });

    it('이름이 없는 사용자일 때 "이름 없음"을 표시해야 함', () => {
      const userWithoutName = { ...mockUser, name: null };
      mockUseAuth.mockReturnValue({
        user: userWithoutName,
        isLoading: false,
        isAuthenticated: true,
        signIn: jest.fn(),
        signOut: jest.fn(),
        refreshUser: jest.fn(),
        error: null,
        clearError: jest.fn(),
        setError: jest.fn(),
      });

      render(
        <TestWrapper>
          <MyPageScreen />
        </TestWrapper>,
      );

      expect(screen.getByText('이름 없음')).toBeTruthy();
      expect(screen.getByText(userWithoutName.email)).toBeTruthy();
    });
  });

  describe('로그아웃 동작', () => {
    it('로그아웃 버튼 클릭 시 signOut이 호출되어야 함', async () => {
      const mockSignOut = jest.fn().mockResolvedValue(undefined);
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
        signIn: jest.fn(),
        signOut: mockSignOut,
        refreshUser: jest.fn(),
        error: null,
        clearError: jest.fn(),
        setError: jest.fn(),
      });

      const { getByText } = render(
        <TestWrapper>
          <MyPageScreen />
        </TestWrapper>,
      );
      const logoutButton = getByText('로그아웃');

      fireEvent.press(logoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledTimes(1);
      });
    });

    it('로그아웃 실패 시 Toast를 표시해야 함', async () => {
      const mockSignOut = jest.fn().mockResolvedValue(undefined);

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
        signIn: jest.fn(),
        signOut: mockSignOut,
        refreshUser: jest.fn(),
        error: null,
        clearError: jest.fn(),
        setError: jest.fn(),
      });

      const { getByText } = render(
        <TestWrapper>
          <MyPageScreen />
        </TestWrapper>,
      );
      const logoutButton = getByText('로그아웃');

      fireEvent.press(logoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });
  });
});
