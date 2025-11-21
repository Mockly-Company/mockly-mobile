/**
 * Google OAuth PKCE 인증 서비스 구현
 * BaseAuthService를 상속받아 Google 전용 로직 구현
 */

import { authorize } from 'react-native-app-auth';
import { auth } from '@mockly/api';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_REDIRECT_URI } from '@env';
import { TOKEN_EXPIRY_BUFFER_MS } from '@shared/constants/auth';
import { BaseAuthService } from './BaseAuthService';
import type { AuthConfig, AuthorizationResult } from '../types';
import { AccessRefreshToken, AuthToken } from '@mockly/entities';

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
        console.log('⚠️ Authorization result incomplete');
        return null;
      }
      return {
        authorizationCode: result.authorizationCode,
        codeVerifier: result.codeVerifier,
      };
    } catch (error) {
      console.error('PKCE 인증 에러', error);
      return null;
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
      const data = await auth.loginGoogleCode({
        code: authorizationCode,
        codeVerifier,
        redirectUri: this.config.redirectUrl,
      });
      return data;
    } catch (error) {
      console.error('토큰 교환에 실패했습니다:', error);
      return null;
    }
  }

  /**
   * Access Token 갱신 (백엔드 API 사용)
   */
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<AccessRefreshToken | null> {
    try {
      const data = await auth.refreshGoogleToken(refreshToken);
      return data;
    } catch (error) {
      console.error('토큰 갱신에 실패했습니다:', error);
      return null;
    }
  }

  /**
   * 로그아웃 및 토큰 폐기 (백엔드 API 사용)
   */
  async revokeToken(_accessToken: string): Promise<boolean> {
    try {
      await auth.revokeGoogleToken();
      return true;
    } catch (error) {
      console.error('토큰 폐기에 실패했습니다:', error);
      return false;
    }
  }

  /**
   * 토큰이 곧 만료되는지 확인 (TOKEN_EXPIRY_BUFFER_MS 사용)
   */
  override isTokenExpiringSoon(expiresAt: number): boolean {
    return super.isTokenExpiringSoon(expiresAt, TOKEN_EXPIRY_BUFFER_MS);
  }
}
