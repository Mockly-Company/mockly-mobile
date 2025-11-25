/**
 * Google OAuth PKCE 인증 서비스 구현
 * BaseAuthService를 상속받아 Google 전용 로직 구현
 */

import { authorize } from 'react-native-app-auth';
import { loginGoogleCode, logout, refreshGoogleToken } from '@mockly/api';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_REDIRECT_URI } from '@env';
import { TOKEN_EXPIRY_BUFFER_MS } from '@shared/constants/auth';
import { BaseAuthService } from './BaseAuthService';
import type { AuthConfig, AuthorizationResult } from '../types';
import { AccessRefreshToken, AuthToken } from '@mockly/entities';
import { AppError, ErrorCoverage } from '@shared/errors';

// 환경 변수 검증
if (!GOOGLE_ANDROID_CLIENT_ID) {
  throw new Error(
    'GOOGLE_ANDROID_CLIENT_ID가 없습니다. 환경 변수 설정을 확인하세요.',
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
      throw AppError.fromUnknownError(
        err,
        ErrorCoverage.LOGGING,
        'Google 인증 실패',
      );
    }
  }

  /**
   * Authorization Code와 Code Verifier를 백엔드로 전송하여 토큰 획득.
   */
  async exchangeCodeForToken(
    authorizationCode: string,
    codeVerifier: string,
  ): Promise<AuthToken | null> {
    try {
      const data = await loginGoogleCode({
        code: authorizationCode,
        codeVerifier,
        redirectUri: this.config.redirectUrl,
      });
      return data;
    } catch (err) {
      throw AppError.fromUnknownError(
        err,
        ErrorCoverage.LOGGING,
        '토큰 교환 실패',
      );
    }
  }

  /**
   * Access Token 갱신 (백엔드 API 사용)
   */
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<AccessRefreshToken | null> {
    try {
      const data = await refreshGoogleToken(refreshToken);
      return data;
    } catch (err) {
      throw AppError.fromUnknownError(
        err,
        ErrorCoverage.LOGGING,
        '토큰 갱신 실패',
      );
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
      throw AppError.fromUnknownError(
        err,
        ErrorCoverage.LOGGING,
        '로그아웃 실패',
      );
    }
  }

  /**
   * 토큰이 곧 만료되는지 확인 (TOKEN_EXPIRY_BUFFER_MS 사용)
   */
  override isTokenExpiringSoon(expiresAt: number): boolean {
    return super.isTokenExpiringSoon(expiresAt, TOKEN_EXPIRY_BUFFER_MS);
  }
}
