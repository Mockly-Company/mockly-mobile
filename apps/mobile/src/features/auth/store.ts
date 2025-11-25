/**
 * Zustand를 사용한 인증 상태 관리
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthService } from './services';
import type { AuthUser, AuthProvider } from './types';
import { AUTH_STORAGE_KEY } from '@shared/constants/auth';
import { AUTH_ERRORS } from './errors';

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
}

interface AuthActions {
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  initialize: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// 인증 상태 저장
const saveAuthState = async (state: StoredAuthState | null): Promise<void> => {
  try {
    if (state) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.error('인증 상태 저장 실패:', error);
  }
};

// 인증 상태 불러오기
const loadAuthState = async (): Promise<StoredAuthState | null> => {
  try {
    const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const state: StoredAuthState = JSON.parse(stored);
    const authService = getAuthService(state.provider);

    // 토큰이 만료되었거나 곧 만료되면 갱신
    const shouldRefresh =
      authService.isTokenExpired(state.expiresAt) ||
      authService.isTokenExpiringSoon(state.expiresAt);

    if (shouldRefresh) {
      const refreshed = await authService.refreshAccessToken(
        state.refreshToken,
      );
      if (refreshed) {
        const newState: StoredAuthState = {
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          user: state.user,
          expiresAt: refreshed.expiresAt.getTime(),
          provider: state.provider,
        };
        await saveAuthState(newState);
        return newState;
      }
      // 갱신 실패 시 저장소 정리
      await saveAuthState(null);
      return null;
    }

    return state;
  } catch (error) {
    console.error('인증 상태 불러오기 실패:', error);
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  // 초기 상태
  user: null,
  isLoading: true,
  isAuthenticated: false,
  authState: null,

  // 로딩 상태 설정
  setLoading: (isLoading: boolean) => set({ isLoading }),

  // 초기화 (앱 시작 시 호출)
  initialize: async () => {
    try {
      const stored = await loadAuthState();
      if (stored) {
        const authUser: AuthUser = {
          id: stored.user.id,
          email: stored.user.email,
          name: stored.user.name,
          photo: null,
          provider: stored.provider,
        };
        set({
          user: authUser,
          authState: stored,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          authState: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('초기화 실패:', error);
      set({
        user: null,
        authState: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // 로그인
  signIn: async (provider: AuthProvider) => {
    set({ isLoading: true });
    try {
      const authService = getAuthService(provider);

      // 1. PKCE를 사용하여 Authorization Code 획득
      const pkceResult = await authService.authorize();
      if (!pkceResult) {
        throw AUTH_ERRORS.CANCELLED();
      }

      // 2. 백엔드로 Code와 Code Verifier 전송하여 토큰 교환
      const tokens = await authService.exchangeCodeForToken(
        pkceResult.authorizationCode,
        pkceResult.codeVerifier,
      );
      if (!tokens) {
        throw AUTH_ERRORS.TOKEN_EXCHANGE_FAILED();
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
      const authUser: AuthUser = {
        id: tokens.user.id,
        email: tokens.user.email,
        name: tokens.user.name,
        photo: null,
        provider,
      };

      set({
        user: authUser,
        authState: newState,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 로그아웃
  signOut: async () => {
    set({ isLoading: true });
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
        isLoading: false,
      });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 사용자 정보 갱신
  refreshUser: async () => {
    try {
      const stored = await loadAuthState();
      if (stored) {
        const authUser: AuthUser = {
          id: stored.user.id,
          email: stored.user.email,
          name: stored.user.name,
          photo: null,
          provider: stored.provider,
        };
        set({
          user: authUser,
          authState: stored,
          isAuthenticated: true,
        });
      } else {
        set({
          user: null,
          authState: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('사용자 정보 갱신 실패:', error);
      set({
        user: null,
        authState: null,
        isAuthenticated: false,
      });
    }
  },

  // 토큰 갱신
  refreshToken: async (): Promise<boolean> => {
    try {
      const { authState } = get();
      if (!authState) {
        return false;
      }

      const authService = getAuthService(authState.provider);
      const refreshed = await authService.refreshAccessToken(
        authState.refreshToken,
      );

      if (!refreshed) {
        // 갱신 실패 시 로그아웃 처리
        await saveAuthState(null);
        set({
          user: null,
          authState: null,
          isAuthenticated: false,
        });
        return false;
      }

      // 갱신된 토큰으로 상태 업데이트
      const newState: StoredAuthState = {
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        user: authState.user,
        expiresAt: refreshed.expiresAt.getTime(),
        provider: authState.provider,
      };

      await saveAuthState(newState);
      set({ authState: newState });
      return true;
    } catch {
      // 갱신 실패 시 로그아웃 처리
      await saveAuthState(null);
      set({
        user: null,
        authState: null,
        isAuthenticated: false,
      });
      return false;
    }
  },
}));
