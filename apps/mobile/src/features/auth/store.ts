/**
 * Zustand를 사용한 인증 상태 관리
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthService } from './services';
import type { AuthUser, AuthProvider } from './types';
import { AUTH_STORAGE_KEY } from '@shared/constants/auth';
import { AccessRefreshToken, AuthToken } from '@mockly/entities';
import { AppError, ErrorCoverage } from '@shared/errors';
import { logger } from '@shared/utils/logger';

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
  signIn: (provider: AuthProvider) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  initialize: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  clearError: () => void;
  setError: (error: Error | null | unknown) => void;
  refreshToken: () => Promise<boolean>;
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
        throw new AppError(err, ErrorCoverage.NONE, '인증 정보 저장 실패');
      },
    );
    return;
  }
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch(err => {
    throw new AppError(err, ErrorCoverage.NONE, '인증 상태 삭제 실패');
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
    const storedAuthState = await loadAuthState();
    if (storedAuthState) {
      const loginStoreState = authStateToLoginStoreState(storedAuthState);
      set(loginStoreState);
      return;
    }
    set(initialStoreState);
  },

  // 로그인
  signIn: async (provider: AuthProvider) => {
    set({ isLoading: true, error: null });
    try {
      const authService = getAuthService(provider);

      // 1. PKCE를 사용하여 Authorization Code 획득
      const pkceResult = await authService.authorize();

      const userCanceled = pkceResult === null;
      if (userCanceled) {
        set({ isLoading: false });
        return null;
      }

      // 2. 백엔드로 Code와 Code Verifier 전송하여 토큰 교환
      const tokens = await authService.exchangeCodeForToken(
        pkceResult.authorizationCode,
        pkceResult.codeVerifier,
      );

      // 3. 인증 상태 디바이스 저장
      const authState = tokenToAuthState(tokens, provider);
      await saveAuthState(authState);

      // 4. 사용자 정보 로컬 상태 업데이트
      const loginStoreState = authStateToLoginStoreState(authState);
      set(loginStoreState);

      return loginStoreState.user?.name || '고객';
    } catch (error) {
      set({ isLoading: false, error });
      throw error;
    }
  },

  // 로그아웃
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { user, authState, isAuthenticated } = get();
      const isLogout = !isAuthenticated || !user || !authState;
      if (isLogout) return;

      const authService = getAuthService(user.provider);
      await authService.logout(authState.accessToken).catch(err => {
        // 로그아웃 실패 시에도 로컬 상태 정리는 진행
        logger.logException(err, { context: '로그아웃 실패' });
      });
      await saveAuthState(null);
      set(initialStoreState);
    } catch (error) {
      set({ isLoading: false, error });
      throw error;
    }
  },

  // 사용자 정보 갱신
  refreshUser: async () => {
    set({ error: null });
    const authState = await loadAuthState();
    const isLogout = !authState;
    if (isLogout) {
      set(initialStoreState);
      return;
    }
    const loginStoreState = authStateToLoginStoreState(authState);
    set(loginStoreState);
  },
  clearError: () => set({ error: null }),
  setError: error => set({ error }),
  refreshToken: async (): Promise<boolean> => {
    try {
      const { authState } = get();
      if (!authState) {
        return false;
      }
      const authService = getAuthService(authState.provider);
      const accessRefreshToken = await authService.refreshAccessToken(
        authState.refreshToken,
      );

      const newAuthState = accessRefreshTokenToAuthState(
        accessRefreshToken,
        authState,
      );
      await saveAuthState(newAuthState);
      set({ authState: newAuthState });
      return true;
    } catch (err) {
      // 갱신 실패 시 로그아웃 처리 후 에러 반환
      await saveAuthState(null);
      set(initialStoreState);
      throw new AppError(
        err,
        ErrorCoverage.NONE,
        '인증 정보 갱신에 실패했습니다. 다시 로그인해 주세요.',
      );
    }
  },
}));

function authStateToLoginStoreState(
  authState: StoredAuthState,
): Partial<AuthStore> {
  const authUser = {
    id: authState.user.id,
    email: authState.user.email,
    name: authState.user.name,
    photo: null,
    provider: authState.provider,
  };
  return {
    user: authUser,
    authState: authState,
    isAuthenticated: true,
    isLoading: false,
  };
}

function tokenToAuthState(
  token: AuthToken,
  provider: AuthProvider,
): StoredAuthState {
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    user: {
      id: token.user.id,
      email: token.user.email,
      name: token.user.name,
    },
    expiresAt: token.expiresAt.getTime(),
    provider,
  };
}

function accessRefreshTokenToAuthState(
  token: AccessRefreshToken,
  authState: StoredAuthState,
): StoredAuthState {
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.expiresAt.getTime(),
    provider: authState.provider,
    user: authState.user,
  };
}
