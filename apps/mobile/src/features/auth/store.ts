/**
 * Zustand를 사용한 인증 상태 관리
 * - 토큰은 별도 storage.ts에서 관리 (MMKV + Keychain)
 * - Store는 사용자 정보, 인증 상태, 로딩 상태만 관리
 */

import { create } from 'zustand';

import { getAuthService } from './services';
import type { AuthProvider } from './types';
import { AppError, ErrorCoverage } from '@shared/errors';
import { logger } from '@shared/utils/logger';
import { localStorage } from './localStorage';
import api from '@mockly/api';
import { AccessRefreshToken } from '@mockly/domain';
import { deviceInfo as deviceInfoFromUtil } from '@shared/utils/deviceInfo';
type AuthState = LoginAuthState | LogoutAuthState;
type LoginAuthState = {
  provider: AuthProvider;
  isAuthenticated: true;
  error?: Error | null | unknown;
};

type LogoutAuthState = {
  provider: null;
  isAuthenticated: false;
  error?: Error | null | unknown;
};

interface AuthActions {
  signIn: (provider: AuthProvider) => Promise<string | null>;
  signOut: () => Promise<void>;
  initialize: () => Promise<AuthProvider | void>;
  clearError: () => void;
  setError: (error: Error | null | unknown) => void;
  refreshToken: () => Promise<boolean>;
  getAccessToken: () => string | null;
  getRefreshToken: () => Promise<string | null>;
  saveTokens: ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  clearTokens: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const initialStoreState: AuthState = {
  provider: null,
  isAuthenticated: false,
};

// Third Party 인증 서비스 때문에 에러 직접 관리 필요. 에러 관련 상태 관리 수정시 주의.
export const useAuthStore = create<AuthStore>((set, get) => ({
  // 초기 상태
  provider: null,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    try {
      const { accessToken, refreshToken } = await localStorage.getTokens();
      if (!accessToken || !refreshToken) {
        set(initialStoreState);
        return;
      }
      const provider = localStorage.getProvider();
      if (!provider) {
        set(initialStoreState);
        return;
      }
      set({
        isAuthenticated: true,
        provider: provider,
      });
      return provider;
    } catch (err) {
      logger.logException(err, { context: '초기화 실패' });
      set(initialStoreState);
      return;
    }
  },

  // 로그인
  signIn: async (provider: AuthProvider) => {
    set({ error: null });
    try {
      const authService = getAuthService(provider);

      // 1. PKCE를 사용하여 Authorization Code 획득
      const pkceResult = await authService.authorize();

      const userCanceled = pkceResult === null;
      if (userCanceled) {
        return null;
      }

      // 2. 백엔드로 Code와 Code Verifier 전송하여 토큰 교환
      const tokens = await authService.exchangeCodeForToken(
        pkceResult.authorizationCode,
        pkceResult.codeVerifier,
        provider,
      );

      // 3. 토큰 저장 (MMKV + Keychain)
      await localStorage.saveTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      localStorage.saveProfivder(provider);

      set({
        provider: provider,
        isAuthenticated: true,
      });

      return provider;
    } catch (error) {
      set({ error });
      throw error;
    }
  },

  // 로그아웃
  signOut: async () => {
    try {
      const { provider, isAuthenticated } = get();
      if (!isAuthenticated || !provider) {
        return;
      }
      const refreshToken = await get().getRefreshToken();
      if (!refreshToken) return;
      api.auth.logout(refreshToken).catch();
    } finally {
      await get().clearTokens();
      set(initialStoreState);
    }
  },

  clearError: () => set({ error: null }),
  setError: error => set({ error }),

  // 토큰 갱신
  refreshToken: async (): Promise<boolean> => {
    try {
      const refreshToken = await get().getRefreshToken();

      if (!refreshToken)
        throw new AppError('리프레시 토큰이 없습니다.', ErrorCoverage.NONE);
      const deviceInfo = {
        deviceId: deviceInfoFromUtil.getDevice(),
        deviceName: await deviceInfoFromUtil.getDeviceName(),
      };
      const newTokens = await api.auth.renewalToken(refreshToken, deviceInfo);
      await get().saveTokens(newTokens);

      return true;
    } catch (err) {
      await get().clearTokens();
      set(initialStoreState);
      throw new AppError(
        err,
        ErrorCoverage.NONE,
        '인증 정보 갱신에 실패했습니다. 다시 로그인해 주세요.',
      );
    }
  },

  // Access Token 가져오기 (API 호출 시 사용)
  getAccessToken: (): string | null => {
    const accessToken = localStorage.getAccessToken();
    return accessToken;
  },
  getRefreshToken: async (): Promise<string | null> => {
    const refreshToken = await localStorage.getRefreshToken();
    return refreshToken;
  },
  saveTokens: async (tokens: AccessRefreshToken): Promise<void> => {
    await localStorage.saveTokens(tokens);
  },
  clearTokens: async (): Promise<void> => {
    await localStorage.clear();
  },
}));
