/**
 * Zustand를 사용한 인증 상태 관리
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthService } from '@lib/app-auth';
import type { AuthUser, AuthProvider } from './types';
import { AUTH_STORAGE_KEY } from '@shared/constants/auth';
import { AUTH_ERRORS } from './errors';

interface StoredAuthState {
  accessToken: string;
  refreshToken: string;
  idToken: string;
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
  initialize: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// ID Token을 AuthUser로 변환
const convertIdTokenToAuthUser = (
  idToken: string,
  provider: AuthProvider,
): AuthUser | null => {
  const authService = getAuthService(provider);
  const userInfo = authService.decodeIdToken(idToken);
  if (!userInfo) return null;

  return {
    id: userInfo.id,
    email: userInfo.email,
    name: userInfo.name || null,
    photo: userInfo.photo || null,
    provider,
  };
};

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
          idToken: state.idToken,
          expiresAt: Date.now() + refreshed.expiresIn * 1000,
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
        const authUser = convertIdTokenToAuthUser(
          stored.idToken,
          stored.provider,
        );
        set({
          user: authUser,
          authState: stored,
          isAuthenticated: authUser !== null,
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

      console.log('시작');
      // 1. PKCE를 사용하여 Authorization Code 획득
      const pkceResult = await authService.authorize();
      if (!pkceResult) {
        throw AUTH_ERRORS.CANCELLED();
      }
      console.log('PKCE Authorization Code 획득 성공', pkceResult);
      // 2. 백엔드로 Code와 Code Verifier 전송하여 토큰 교환
      const tokens = await authService.exchangeCodeForToken(
        pkceResult.authorizationCode,
        pkceResult.codeVerifier,
      );
      console.log('백엔드로부터 토큰 교환 성공', tokens);
      if (!tokens) {
        throw AUTH_ERRORS.TOKEN_EXCHANGE_FAILED();
      }

      // 3. 토큰 저장
      const newState: StoredAuthState = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        idToken: tokens.idToken,
        expiresAt: Date.now() + tokens.expiresIn * 1000,
        provider,
      };

      await saveAuthState(newState);

      // 4. 사용자 정보 설정
      const authUser = convertIdTokenToAuthUser(tokens.idToken, provider);
      set({
        user: authUser,
        authState: newState,
        isAuthenticated: authUser !== null,
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
        await authService.revokeToken(authState.accessToken);
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
        const authUser = convertIdTokenToAuthUser(
          stored.idToken,
          stored.provider,
        );
        set({
          user: authUser,
          authState: stored,
          isAuthenticated: authUser !== null,
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
}));
