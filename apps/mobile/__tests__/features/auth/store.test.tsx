/**
 * useAuth 훅 테스트
 * Provider 패턴 기반 인증 및 초기 로그인 상태 확인 기능 테스트
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@features/auth/hooks';
import { useAuthStore } from '@features/auth/store';
import { GoogleAuthService } from '@features/auth/services/GoogleAuthService';
import type { AuthUser, AuthorizationResult } from '@features/auth/types';
import type { AuthToken, AccessRefreshToken } from '@mockly/entities';

// AsyncStorage 모킹
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// GoogleAuthService 모킹
jest.mock('@features/auth/services/GoogleAuthService');

const expectedAuthUser: AuthUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  photo: null,
  provider: 'google',
};

const mockStoredAuthState = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  },
  expiresAt: Date.now() + 3600000,
  provider: 'google' as const,
};

// Mock 인스턴스 생성
const mockGoogleAuthService = {
  authorize: jest.fn<Promise<AuthorizationResult | null>, []>(),
  exchangeCodeForToken: jest.fn<
    Promise<AuthToken | null>,
    [authorizationCode: string, codeVerifier: string]
  >(),
  refreshAccessToken: jest.fn<
    Promise<AccessRefreshToken | null>,
    [refreshToken: string]
  >(),
  revokeToken: jest.fn<Promise<boolean>, [accessToken: string]>(),
  isTokenExpired: jest.fn<boolean, [expiresAt: number]>(),
  isTokenExpiringSoon: jest.fn<boolean, [expiresAt: number]>(),
};

// GoogleAuthService constructor를 mock으로 대체
(
  GoogleAuthService as jest.MockedClass<typeof GoogleAuthService>
).mockImplementation(
  () => mockGoogleAuthService as unknown as GoogleAuthService,
);

const setupValidTokenMocks = () => {
  mockGoogleAuthService.isTokenExpired.mockReturnValue(false);
  mockGoogleAuthService.isTokenExpiringSoon.mockReturnValue(false);
};

const setupExpiredTokenMocks = () => {
  mockGoogleAuthService.isTokenExpired.mockReturnValue(true);
  mockGoogleAuthService.isTokenExpiringSoon.mockReturnValue(false);
};

const setupExpiringSoonTokenMocks = () => {
  mockGoogleAuthService.isTokenExpired.mockReturnValue(false);
  mockGoogleAuthService.isTokenExpiringSoon.mockReturnValue(true);
};

const mockSuccessfulLogin = () => {
  mockGoogleAuthService.authorize.mockResolvedValue({
    authorizationCode: 'mock-auth-code',
    codeVerifier: 'mock-code-verifier',
  });

  mockGoogleAuthService.exchangeCodeForToken.mockResolvedValue({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    },
    expiresAt: new Date(Date.now() + 3600000),
  });
};

const mockSuccessfulRefresh = () => {
  mockGoogleAuthService.refreshAccessToken.mockResolvedValue({
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
    expiresAt: new Date(Date.now() + 3600000),
  });
};

// 테스트 헬퍼: initialize 호출
const initializeStore = async () => {
  await useAuthStore.getState().initialize();
};

describe('AuthStore - Provider 패턴 기반 인증', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      authState: null,
    });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('로그인 플로우', () => {
    it('Google 로그인이 성공해야 함', async () => {
      mockSuccessfulLogin();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('google');
      });

      expect(mockGoogleAuthService.authorize).toHaveBeenCalledTimes(1);
      expect(mockGoogleAuthService.exchangeCodeForToken).toHaveBeenCalledWith(
        'mock-auth-code',
        'mock-code-verifier',
      );
      expect(result.current.user).toEqual(expectedAuthUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('Authorization 실패 시 에러를 던져야 함', async () => {
      mockGoogleAuthService.authorize.mockResolvedValue(null);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.signIn('google');
        }),
      ).rejects.toThrow();
    });

    it('토큰 교환 실패 시 에러를 던져야 함', async () => {
      mockGoogleAuthService.authorize.mockResolvedValue({
        authorizationCode: 'mock-auth-code',
        codeVerifier: 'mock-code-verifier',
      });
      mockGoogleAuthService.exchangeCodeForToken.mockResolvedValue(null);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.signIn('google');
        }),
      ).rejects.toThrow();
    });
  });

  describe('로그아웃 플로우', () => {
    it('로그아웃이 성공적으로 수행되어야 함', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockStoredAuthState),
      );
      setupValidTokenMocks();
      mockGoogleAuthService.revokeToken.mockResolvedValue(true);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.user).toEqual(expectedAuthUser);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockGoogleAuthService.revokeToken).toHaveBeenCalledWith(
        'mock-access-token',
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@mockly_auth_state',
      );
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('로그인하지 않은 상태에서 로그아웃해도 정상 동작해야 함', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockGoogleAuthService.revokeToken).not.toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('앱 재실행 시 로그인 상태 유지', () => {
    it('저장된 토큰이 유효하면 자동으로 로그인되어야 함', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockStoredAuthState),
      );
      setupValidTokenMocks();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(expectedAuthUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('저장된 토큰이 없으면 로그인 안된 상태여야 함', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('토큰이 만료되었으면 Refresh Token으로 갱신해야 함', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockStoredAuthState),
      );
      setupExpiredTokenMocks();
      mockSuccessfulRefresh();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGoogleAuthService.refreshAccessToken).toHaveBeenCalledWith(
        'mock-refresh-token',
      );
      expect(result.current.user).toEqual(expectedAuthUser);
    });

    it('토큰 갱신 실패 시 로그인 안된 상태로 전환해야 함', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockStoredAuthState),
      );
      setupExpiredTokenMocks();
      mockGoogleAuthService.refreshAccessToken.mockResolvedValue(null);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('토큰이 곧 만료되면 미리 갱신해야 함', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockStoredAuthState),
      );
      setupExpiringSoonTokenMocks();
      mockSuccessfulRefresh();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGoogleAuthService.refreshAccessToken).toHaveBeenCalledWith(
        'mock-refresh-token',
      );
    });
  });

  describe('refreshUser 기능', () => {
    it('refreshUser 호출 시 저장된 토큰으로 사용자 정보를 갱신해야 함', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockStoredAuthState),
      );
      setupValidTokenMocks();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.user).toEqual(expectedAuthUser);
    });

    it('refreshUser 호출 시 저장된 토큰이 없으면 null로 설정해야 함', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('에러 핸들링', () => {
    it('AsyncStorage 저장 실패 시 에러를 로깅해야 함', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error'),
      );
      mockSuccessfulLogin();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('google');
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '인증 상태 저장 실패:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it('AsyncStorage 불러오기 실패 시 null을 반환해야 함', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error'),
      );
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '인증 상태 불러오기 실패:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it('로그아웃 시 revokeToken 실패해도 에러가 발생해야 함', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockStoredAuthState),
      );
      setupValidTokenMocks();
      mockGoogleAuthService.revokeToken.mockRejectedValue(
        new Error('Revoke failed'),
      );
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.user).toEqual(expectedAuthUser);
      });

      await expect(
        act(async () => {
          await result.current.signOut();
        }),
      ).rejects.toThrow('Revoke failed');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '로그아웃 실패:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
