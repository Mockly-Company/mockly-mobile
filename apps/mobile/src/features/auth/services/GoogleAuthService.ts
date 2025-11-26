/**
 * Google OAuth PKCE 인증 서비스 구현
 * BaseAuthService를 상속받아 Google 전용 로직 구현
 */

import { authorize } from 'react-native-app-auth';

import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_REDIRECT_URI } from '@env';
import { TOKEN_EXPIRY_BUFFER_MS } from '@shared/constants/auth';
import { BaseAuthService } from './BaseAuthService';
import type { AuthConfig, AuthorizationResult } from '../types';
import { AccessRefreshToken, AuthToken } from '@mockly/entities';
import { loginGoogleCode, logout, refreshGoogleToken } from '@mockly/api';
import { logger } from '@shared/utils/logger';
import { AppError, ErrorCoverage } from '@shared/errors/AppError';

// 환경 변수 검증
if (!GOOGLE_ANDROID_CLIENT_ID) {
  throw new AppError(
    'GOOGLE_ANDROID_CLIENT_ID가 없습니다. 환경 변수 설정을 확인하세요.',
    ErrorCoverage.GLOBAL,
    '환경 설정 오류',
  );
}

export class GoogleAuthService extends BaseAuthService {
  constructor() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      clientId: GOOGLE_ANDROID_CLIENT_ID,
      redirectUrl: GOOGLE_REDIRECT_URI,
      scopes: ['openid', 'email', 'profile'],
    };
    super(config);
  }

  /**
   * PKCE를 사용한 인증 시작
   * Authorization Code와 Code Verifier를 반환
   */
  async authorize(): Promise<AuthorizationResult | null> {
    try {
      const result = await authorize({
        ...this.config,
        skipCodeExchange: true, // 토큰 교환은 백엔드에서 처리
        usePKCE: true,
      });

      if (!result.authorizationCode || !result.codeVerifier) {
        return null;
      }
      return {
        authorizationCode: result.authorizationCode,
        codeVerifier: result.codeVerifier,
      };
    } catch (err) {
      logger.logException(err, {
        context: 'GoogleAuthService.authorize',
        message: 'Google 인증 실패',
      });
      throw err;
    }
  }

  /**
   * Authorization Code와 Code Verifier를 백엔드로 전송하여 토큰 획득.
   */
  async exchangeCodeForToken(
    authorizationCode: string,
    codeVerifier: string,
  ): Promise<AuthToken> {
    try {
      const data = await loginGoogleCode({
        code: authorizationCode,
        codeVerifier,
        redirectUri: this.config.redirectUrl,
      });
      if (!data) {
        const error = new AppError(
          '서버로부터 토큰을 획득하지 못했습니다.',
          ErrorCoverage.NONE,
          '토큰 획득 실패',
        );
        throw error;
      }
      return data;
    } catch (err) {
      if (AppError.isApiError(err)) {
        throw err;
      }
      const error = new AppError(
        'Google 토큰 교환 중 오류가 발생했습니다.',
        ErrorCoverage.NONE,
        '토큰 교환 실패',
      );

      throw error;
    }
  }

  /**
   * Access Token 갱신 (백엔드 API 사용)
   */
  async refreshAccessToken(refreshToken: string): Promise<AccessRefreshToken> {
    try {
      const data = await refreshGoogleToken(refreshToken);
      if (!data)
        throw new AppError(
          '서버로부터 갱신된 토큰을 획득하지 못했습니다.',
          ErrorCoverage.NONE,
          '토큰 갱신 실패',
        );
      return data;
    } catch (err) {
      logger.logException(err, {
        context: 'GoogleAuthService.refreshAccessToken',
        message: '토큰 갱신 실패',
      });
      throw err;
    }
  }

  /**
   * 로그아웃 및 토큰 폐기 (백엔드 API 사용)
   */
  async logout(_accessToken: string): Promise<boolean> {
    try {
      await logout();
      return true;
    } catch (err) {
      logger.logException(err, {
        context: 'GoogleAuthService.logout',
        message: '로그아웃 실패',
      });
      throw err;
    }
  }

  /**
   * 토큰이 곧 만료되는지 확인 (TOKEN_EXPIRY_BUFFER_MS 사용)
   */
  override isTokenExpiringSoon(expiresAt: number): boolean {
    return super.isTokenExpiringSoon(expiresAt, TOKEN_EXPIRY_BUFFER_MS);
  }
}
