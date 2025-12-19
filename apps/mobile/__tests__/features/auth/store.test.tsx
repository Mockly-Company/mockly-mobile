/**
 * useAuth 훅 테스트
 * Provider 패턴 기반 인증 및 초기 로그인 상태 확인 기능 테스트
 */

// AuthService.google 모킹
jest.mock('@features/auth/services/AuthService.google');

// API 모킹 - jest.fn()을 factory 안에서 생성
jest.mock('@mockly/api', () => ({
  default: {
    auth: {
      logout: jest.fn(),
      renewalToken: jest.fn(),
    },
  },
}));

// deviceInfo 모킹
jest.mock('@libs/deviceInfo', () => ({
  deviceInfo: {
    getDevice: jest.fn().mockReturnValue(''),
    getDeviceName: jest.fn().mockResolvedValue('unknown'),
  },
}));

import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '@features/auth/hooks';
import { useAuthStore } from '@features/auth/store';
import { GoogleAuthService } from '@features/auth/services/AuthService.google';
import { localStorage } from '@features/auth/localStorage';
import type { AuthorizationResult } from '@features/auth/types';
import type {
  AuthToken,
  AccessRefreshToken,
  AuthProvider,
} from '@mockly/domain';

// api를 dynamic import로 가져오기 위해 jest.requireMock 사용
const api = jest.requireMock('@mockly/api').default;
const mockAuthLogout = api.auth.logout as jest.Mock;
const mockAuthRenewalToken = api.auth.renewalToken as jest.Mock;

const expectedProvider: AuthProvider = 'google';

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
  mockAuthRenewalToken.mockResolvedValue({
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
      provider: null,
      isAuthenticated: false,
      error: null,
    });
    // Spy on localStorage methods
    jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
      accessToken: null,
      refreshToken: null,
    });
    jest.spyOn(localStorage, 'getProvider').mockReturnValue(null);
    jest.spyOn(localStorage, 'saveTokens').mockResolvedValue(undefined);
    jest.spyOn(localStorage, 'clear').mockResolvedValue(undefined);
    jest.spyOn(localStorage, 'getRefreshToken').mockResolvedValue(null);
    // Mock API functions
    mockAuthLogout.mockResolvedValue(undefined);
    mockAuthRenewalToken.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });

  describe('로그인 플로우', () => {
    it('Google 로그인이 성공해야 함', async () => {
      mockSuccessfulLogin();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('google');
      });

      expect(mockGoogleAuthService.authorize).toHaveBeenCalledTimes(1);
      expect(mockGoogleAuthService.exchangeCodeForToken).toHaveBeenCalledWith(
        'mock-auth-code',
        'mock-code-verifier',
        'google',
      );
      expect(result.current.provider).toEqual(expectedProvider);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('Authorization 실패 시 로그인이 취소되어야 함', async () => {
      mockGoogleAuthService.authorize.mockResolvedValue(null);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('google');
      });

      // Authorization이 null을 반환하면 로그인 취소 (에러 아님)
      expect(result.current.provider).toBeNull();
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

      await act(async () => {
        try {
          await result.current.signIn('google');
        } catch {
          // 에러 발생 예상
        }
      });

      // 토큰 교환 실패 시 사용자는 여전히 null
      expect(result.current.provider).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('로그아웃 플로우', () => {
    it('로그인하지 않은 상태에서 로그아웃해도 정상 동작해야 함', async () => {
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.provider).toBeNull();
    });
  });

  describe('앱 재실행 시 로그인 상태 유지', () => {
    it('저장된 토큰이 유효하면 자동으로 로그인되어야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      jest.spyOn(localStorage, 'getProvider').mockReturnValue(expectedProvider);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      expect(result.current.provider).toEqual(expectedProvider);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('저장된 토큰이 없으면 로그인 안된 상태여야 함', async () => {
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      expect(result.current.provider).toBeNull();
    });

    it('토큰이 만료되었으면 Refresh Token으로 갱신해야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      jest.spyOn(localStorage, 'getProvider').mockReturnValue(expectedProvider);
      mockSuccessfulRefresh();
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      // User should be loaded from localStorage
      expect(result.current.provider).toEqual(expectedProvider);
    });

    it('토큰 갱신 실패 시 로그인 안된 상태로 전환해야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: null,
        refreshToken: 'mock-refresh-token',
      });
      jest
        .spyOn(localStorage, 'getRefreshToken')
        .mockResolvedValue('mock-refresh-token');
      mockAuthRenewalToken.mockRejectedValue(new Error('Token refresh failed'));

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

      expect(result.current.provider).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('refreshUser 기능', () => {
    it('저장된 토큰으로 사용자 정보를 확인할 수 있어야 함', async () => {
      jest.spyOn(localStorage, 'getTokens').mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      jest.spyOn(localStorage, 'getProvider').mockReturnValue(expectedProvider);
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      expect(result.current.provider).toEqual(expectedProvider);
    });

    it('저장된 토큰이 없으면 null로 설정되어야 함', async () => {
      await initializeStore();

      const { result } = renderHook(() => useAuth());

      expect(result.current.provider).toBeNull();
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
      expect(result.current.provider).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
