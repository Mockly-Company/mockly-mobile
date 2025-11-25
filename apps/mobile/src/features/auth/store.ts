/**
 * Zustand를 사용한 인증 상태 관리
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthService } from './services';
import type { AuthUser, AuthProvider } from './types';
import { AUTH_STORAGE_KEY } from '@shared/constants/auth';
import { AppError, ErrorCoverage } from '@shared/errors';

interface StoredAuthState {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  expiresAt: number;
  provider: AuthProvider;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authState: StoredAuthState | null;
  error?: Error | null | unknown;
}

interface AuthActions {
  signIn: (provider: AuthProvider) => Promise<string>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  initialize: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  clearError: () => void;
  setError: (error: Error | null | unknown) => void;
}

type AuthStore = AuthState & AuthActions;

const initialStoreState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  authState: null,
};

// 인증 상태 저장
const saveAuthState = async (state: StoredAuthState | null): Promise<void> => {
  if (state) {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state)).catch(
      err => {
        throw AppError.fromUnknownError(
          err,
          ErrorCoverage.LOGGING,
          '인증 상태 저장 실패',
        );
      },
    );
    return;
  }
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch(err => {
    throw AppError.fromUnknownError(
      err,
      ErrorCoverage.LOGGING,
      '인증 상태 삭제 실패',
    );
  });
};

// AsyncStorage에서 인증 상태 불러오기
const loadStoredAuthState = async (): Promise<StoredAuthState | null> => {
  const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

// 토큰 만료 확인 및 갱신
const refreshIfNeeded = async (
  state: StoredAuthState,
): Promise<StoredAuthState | null> => {
  const authService = getAuthService(state.provider);

  // 토큰이 만료되지 않았으면 그대로 반환
  const shouldRefresh =
    authService.isTokenExpired(state.expiresAt) ||
    authService.isTokenExpiringSoon(state.expiresAt);

  if (!shouldRefresh) {
    return state;
  }

  // 토큰 갱신 시도
  const refreshed = await authService.refreshAccessToken(state.refreshToken);
  if (!refreshed) {
    return null; // 갱신 실패
  }

  return {
    ...state,
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    expiresAt: refreshed.expiresAt.getTime(),
  };
};

// 인증 상태 불러오기 (토큰 갱신 포함)
const loadAuthState = async (): Promise<StoredAuthState | null> => {
  const stored = await loadStoredAuthState();
  if (!stored) {
    return null;
  }

  const refreshedState = await refreshIfNeeded(stored);

  // 갱신된 경우에만 저장
  if (refreshedState && refreshedState !== stored) {
    await saveAuthState(refreshedState);
  } else if (!refreshedState) {
    // 갱신 실패 시 저장소 정리
    await saveAuthState(null);
  }

  return refreshedState;
};

// Third Party 인증 서비스 때문에 에러 직접 관리 필요. 에러 관련 상태 관리 수정시 주의.
export const useAuthStore = create<AuthStore>((set, get) => ({
  // 초기 상태
  user: null,
  isLoading: true,
  isAuthenticated: false,
  authState: null,
  error: null,

  // 로딩 상태 설정
  setLoading: (isLoading: boolean) => set({ isLoading }),

  // 초기화 (앱 시작 시 호출)
  initialize: async () => {
    try {
      const stored = await loadAuthState();
      if (stored) {
        const authUser = storedToAuthUser(stored);
        set({
          user: authUser,
          authState: stored,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set(initialStoreState);
      }
    } catch (error) {
      set({ ...initialStoreState, error });
      throw AppError.fromUnknownError(
        error,
        ErrorCoverage.GLOBAL,
        '앱 초기화 실패',
      );
    }
  },

  // 로그인
  signIn: async (provider: AuthProvider) => {
    set({ isLoading: true, error: null });
    try {
      const authService = getAuthService(provider);

      // 1. PKCE를 사용하여 Authorization Code 획득
      const pkceResult = await authService.authorize();
      if (!pkceResult) {
        throw new AppError(
          '로그인 취소',
          ErrorCoverage.LOGGING,
          '사용자가 로그인을 취소했습니다.',
        );
      }

      // 2. 백엔드로 Code와 Code Verifier 전송하여 토큰 교환
      const tokens = await authService
        .exchangeCodeForToken(
          pkceResult.authorizationCode,
          pkceResult.codeVerifier,
        )
        .catch(err => {
          throw AppError.fromUnknownError(
            err,
            ErrorCoverage.LOGGING,
            '서버와 토큰 교환 실패',
          );
        });
      if (!tokens) {
        throw new AppError(
          '토큰 획득 실패',
          ErrorCoverage.LOGGING,
          '서버로부터 토큰을 획득하지 못했습니다.',
        );
      }
      // 3. 토큰 저장
      const newState: StoredAuthState = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: tokens.user,
        expiresAt: tokens.expiresAt.getTime(),
        provider,
      };

      await saveAuthState(newState);

      // 4. 사용자 정보 설정
      const authUser = storedToAuthUser(newState);
      set({
        user: authUser,
        authState: newState,
        isAuthenticated: true,
        isLoading: false,
      });
      return authUser.name || '고객';
    } catch (error) {
      const appError = AppError.fromUnknownError(
        error,
        ErrorCoverage.LOGGING,
        '로그인 처리 중 오류 발생',
      );
      set({ isLoading: false, error: appError });
      throw appError;
    }
  },

  // 로그아웃
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user, authState } = get();

      if (user?.provider && authState?.accessToken) {
        const authService = getAuthService(user.provider);
        await authService.logout(authState.accessToken);
      }

      await saveAuthState(null);
      set({
        user: null,
        authState: null,
        isAuthenticated: false,
      });
    } catch (error) {
      const appError = AppError.fromUnknownError(
        error,
        ErrorCoverage.LOGGING,
        '로그아웃 처리 중 오류 발생',
      );
      set({ error: appError });
      throw appError;
    } finally {
      set({ isLoading: false });
    }
  },

  // 사용자 정보 갱신
  refreshUser: async () => {
    set({ error: null });
    try {
      const stored = await loadAuthState();
      if (stored) {
        const authUser = storedToAuthUser(stored);
        set({
          user: authUser,
          authState: stored,
          isAuthenticated: true,
        });
      } else {
        set(initialStoreState);
      }
    } catch (err) {
      const appError = AppError.fromUnknownError(
        err,
        ErrorCoverage.LOGGING,
        '사용자 정보 갱신 실패',
      );
      set({ ...initialStoreState, error: appError });
      throw appError;
    }
  },
  clearError: () => set({ error: null }),
  setError: error => set({ error }),
}));

function storedToAuthUser(stored: StoredAuthState): AuthUser {
  return {
    id: stored.user.id,
    email: stored.user.email,
    name: stored.user.name,
    photo: null,
    provider: stored.provider,
  };
}
