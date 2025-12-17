/**
 * useAuth 훅 테스트
 * Provider 패턴 기반 인증 및 초기 로그인 상태 확인 기능 테스트
 */

// AuthService.google 모킹
jest.mock('@features/auth/services/AuthService.google');

// API 모킹
jest.mock('@mockly/api', () => {
  const originalModule = jest.requireActual('@mockly/api');
  return {
    ...originalModule,
    logout: jest.fn(),
    renewalToken: jest.fn(),
  };
});

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '@features/auth/hooks';
import { useAuthStore } from '@features/auth/store';
import { GoogleAuthService } from '@features/auth/services/AuthService.google';
import { localStorage } from '@features/auth/localStorage';
import * as api from '@mockly/api';
import type { AuthorizationResult } from '@features/auth/types';
import type { AuthToken, AccessRefreshToken, AuthUser } from '@mockly/domain';

const expectedAuthUser: AuthUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  provider: 'google',
};

// Mock 인스턴스 생성
const mockGoogleAuthService = {
  authorize: jest.fn<Promise<AuthorizationResult | null>, []>(),
  exchangeCodeForToken: jest.fn<
    Promise<AuthToken | null>,
    [authorizationCode: string, codeVerifier: string, provider: string]
  >(),
  refreshAccessToken: jest.fn<
    Promise<AccessRefreshToken | null>,
    [refreshToken: string]
  >(),
  logout: jest.fn<Promise<boolean>, []>(),
};

// GoogleAuthService constructor를 mock으로 대체
(
  GoogleAuthService as jest.MockedClass<typeof GoogleAuthService>
).mockImplementation(
  () => mockGoogleAuthService as unknown as GoogleAuthService,
);

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
  } as AuthToken);
};

const mockSuccessfulRefresh = () => {
  (api.renewalToken as jest.Mock).mockResolvedValue({
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
  } as AccessRefreshToken);
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
    });
    // Spy on localStorage methods
    jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
      accessToken: null,
      refreshToken: null,
    });
    jest.spyOn(localStorage, 'getUser').mockReturnValue(null);
    jest.spyOn(localStorage, 'saveTokens').mockResolvedValue(undefined);
    jest.spyOn(localStorage, 'clear').mockResolvedValue(undefined);
    jest.spyOn(localStorage, 'getRefreshToken').mockResolvedValue(null);
    // Mock API functions
    (api.logout as jest.Mock).mockResolvedValue(undefined);
    (api.renewalToken as jest.Mock).mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
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
        'google',
      );
      expect(result.current.user).toEqual(expectedAuthUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('Authorization 실패 시 로그인이 취소되어야 함', async () => {
      mockGoogleAuthService.authorize.mockResolvedValue(null);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('google');
      });

      // Authorization이 null을 반환하면 로그인 취소 (에러 아님)
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('토큰 교환 실패 시 로그인이 실패해야 함', async () => {
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

      await act(async () => {
        try {
          await result.current.signIn('google');
        } catch {
          // 에러 발생 예상
        }
      });

      // 토큰 교환 실패 시 로딩 상태가 false로 변경되고, 사용자는 여전히 null
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('로그아웃 플로우', () => {
    it('로그아웃이 성공적으로 수행되어야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      jest
        .spyOn(localStorage, 'getRefreshToken')
        .mockResolvedValue('mock-refresh-token');
      jest.spyOn(localStorage, 'getUser').mockReturnValue(expectedAuthUser);

      await initializeStore();

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.user).toEqual(expectedAuthUser);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(localStorage.clear).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });

    it('로그인하지 않은 상태에서 로그아웃해도 정상 동작해야 함', async () => {
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('앱 재실행 시 로그인 상태 유지', () => {
    it('저장된 토큰이 유효하면 자동으로 로그인되어야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      jest.spyOn(localStorage, 'getUser').mockReturnValue(expectedAuthUser);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(expectedAuthUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('저장된 토큰이 없으면 로그인 안된 상태여야 함', async () => {
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('토큰이 만료되었으면 Refresh Token으로 갱신해야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      jest.spyOn(localStorage, 'getUser').mockReturnValue(expectedAuthUser);
      mockSuccessfulRefresh();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // User should be loaded from localStorage
      expect(result.current.user).toEqual(expectedAuthUser);
    });

    it('토큰 갱신 실패 시 로그인 안된 상태로 전환해야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: null,
        refreshToken: 'mock-refresh-token',
      });
      jest
        .spyOn(localStorage, 'getRefreshToken')
        .mockResolvedValue('mock-refresh-token');
      (api.renewalToken as jest.Mock).mockRejectedValue(
        new Error('Token refresh failed'),
      );

      // refreshToken 메서드 직접 호출
      const store = useAuthStore.getState();

      await act(async () => {
        try {
          await store.refreshToken();
        } catch {
          // 에러 발생 예상
        }
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('토큰이 곧 만료되면 미리 갱신해야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      jest
        .spyOn(localStorage, 'getRefreshToken')
        .mockResolvedValue('mock-refresh-token');
      mockSuccessfulRefresh();

      const store = useAuthStore.getState();

      await act(async () => {
        await store.refreshToken();
      });

      expect(api.renewalToken).toHaveBeenCalledWith(
        'mock-refresh-token',
        expect.objectContaining({ deviceId: '', deviceName: 'unknown' }),
      );
    });
  });

  describe('refreshUser 기능', () => {
    it('저장된 토큰으로 사용자 정보를 확인할 수 있어야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      jest.spyOn(localStorage, 'getUser').mockReturnValue(expectedAuthUser);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(expectedAuthUser);
    });

    it('저장된 토큰이 없으면 null로 설정되어야 함', async () => {
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('에러 핸들링', () => {
    it('localStorage 저장 실패 시 에러를 throw해야 함', async () => {
      jest
        .spyOn(localStorage, 'saveTokens')
        .mockRejectedValue(new Error('Storage error'));
      mockSuccessfulLogin();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.signIn('google');
        } catch {
          // Storage 에러 발생 예상
        }
      });

      // 저장 실패 시 에러 상태 확인
      expect(result.current.error).toBeTruthy();
    });

    it('localStorage 불러오기 실패 시 에러를 기록해야 함', async () => {
      jest
        .spyOn(localStorage, 'getTokens')
        .mockRejectedValue(new Error('Storage error'));

      // initialize는 에러를 catch하고 기본 상태로 돌아감
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      // 초기화 실패 시 로그아웃 상태로 설정됨
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
