/**
 * Google OAuth PKCE 인증 서비스 구현
 * BaseAuthService를 상속받아 Google 전용 로직 구현
 */

import { authorize } from 'react-native-app-auth';
import { decode as atob } from 'base-64';
import { GOOGLE_WEB_CLIENT_ID, API_BASE_URL } from '@env';
import { TOKEN_EXPIRY_BUFFER_MS } from '@shared/constants/auth';
import { BaseAuthService } from '../base/BaseAuthService';
import type {
  AuthConfig,
  AuthorizationResult,
  TokenResponse,
  RefreshTokenResponse,
  UserInfo,
} from '../base/types';

// 환경 변수 검증
if (!GOOGLE_WEB_CLIENT_ID) {
  throw new Error(
    'GOOGLE_WEB_CLIENT_ID가 없습니다. 환경 변수 설정을 확인하세요.',
  );
}
if (!API_BASE_URL) {
  throw new Error('API_BASE_URL이 없습니다. 환경 변수 설정을 확인하세요.');
}

export class GoogleAuthService extends BaseAuthService {
  constructor() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      clientId: GOOGLE_WEB_CLIENT_ID,
      redirectUrl: `${API_BASE_URL}/login/oauth2/code/google`,
      scopes: ['openid'],
    };
    super(config);
  }

  /**
   * PKCE를 사용한 Google 로그인
   * Authorization Code만 받아서 백엔드로 전달
   */
  async authorize(): Promise<AuthorizationResult | null> {
    try {
      const result = await authorize({
        issuer: this.config.issuer,
        clientId: this.config.clientId,
        redirectUrl: this.config.redirectUrl,
        scopes: this.config.scopes,
        skipCodeExchange: true, // 토큰 교환은 백엔드에서 처리
      });

      if (!result.authorizationCode || !result.codeVerifier) {
        console.log('⚠️ Authorization result incomplete');
        return null;
      }

      console.log('✅ Authorization successful');
      return {
        authorizationCode: result.authorizationCode,
        codeVerifier: result.codeVerifier,
      };
    } catch (error) {
      console.error('❌ PKCE Authorization Error:', error);
      return null;
    }
  }

  /**
   * 백엔드로 Authorization Code 전송하여 토큰 교환
   */
  async exchangeCodeForToken(
    authorizationCode: string,
    codeVerifier: string,
  ): Promise<TokenResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authorizationCode,
          codeVerifier,
          redirectUri: this.config.redirectUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`토큰 교환에 실패했습니다: ${response.status}`);
      }

      const data: TokenResponse = await response.json();

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
  ): Promise<RefreshTokenResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data: RefreshTokenResponse = await response.json();

      return data;
    } catch (error) {
      console.error('토큰 갱신에 실패했습니다:', error);
      return null;
    }
  }

  /**
   * 로그아웃 및 토큰 폐기 (백엔드 API 사용)
   */
  async revokeToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`토큰 폐기에 실패했습니다: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('토큰 폐기에 실패했습니다:', error);
      return false;
    }
  }

  /**
   * ID Token에서 사용자 정보 추출
   * JWT ID Token을 디코딩하여 사용자 정보 반환
   */
  decodeIdToken(idToken: string): UserInfo | null {
    try {
      // JWT는 header.payload.signature 형식
      const payload = idToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      return {
        id: decodedPayload.sub,
        email: decodedPayload.email,
        name: decodedPayload.name,
        photo: decodedPayload.picture,
        emailVerified: decodedPayload.email_verified,
      };
    } catch (error) {
      console.error('ID 토큰 디코딩에 실패했습니다.:', error);
      return null;
    }
  }

  /**
   * 토큰이 곧 만료되는지 확인 (TOKEN_EXPIRY_BUFFER_MS 사용)
   */
  override isTokenExpiringSoon(expiresAt: number): boolean {
    return super.isTokenExpiringSoon(expiresAt, TOKEN_EXPIRY_BUFFER_MS);
  }
}
