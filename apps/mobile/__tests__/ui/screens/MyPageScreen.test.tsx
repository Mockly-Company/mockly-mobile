// Mock hooks before import
jest.mock('@features/auth/hooks');

import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import { MyPageScreen } from '@app/screens/profile/MyPageScreen';
import { useLoggedInAuth } from '@features/auth/hooks';
import { ErrorBoundary } from 'react-error-boundary';
import React from 'react';
import { AuthUser } from '@mockly/domain';

// 테스트용 ErrorBoundary 래퍼
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary fallback={<></>}>{children}</ErrorBoundary>
);

const mockUseLoggedInAuth = useLoggedInAuth as jest.MockedFunction<
  typeof useLoggedInAuth
>;

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

  describe('로그인된 상태', () => {
    it('로그인했을 때 사용자 정보를 표시해야 함', () => {
      mockUseLoggedInAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        signOut: jest.fn(),
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
      const userWithoutName = { ...mockUser, name: '' };
      mockUseLoggedInAuth.mockReturnValue({
        user: userWithoutName,
        isLoading: false,
        signOut: jest.fn(),
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
      mockUseLoggedInAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        signOut: mockSignOut,
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
  });
});
