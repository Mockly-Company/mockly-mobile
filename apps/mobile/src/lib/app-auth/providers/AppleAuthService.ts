/**
 * Apple OAuth 인증 서비스 구현 (준비)
 * BaseAuthService를 상속받아 Apple 전용 로직 구현
 */

import { BaseAuthService } from '../base/BaseAuthService';
import type {
  AuthConfig,
  AuthorizationResult,
  TokenResponse,
  RefreshTokenResponse,
  UserInfo,
} from '../base/types';

// TODO: AuthService 확장시 구현 필요
export class AppleAuthService extends BaseAuthService {
  constructor() {
    const config: AuthConfig = {
      issuer: 'https://appleid.apple.com',
      clientId: 'com.mockly.mobile', // 추후 환경 변수로 이동
      redirectUrl: 'https://mockly.com/auth/apple/callback',
      scopes: ['email', 'name'],
    };
    super(config);
  }

  async authorize(): Promise<AuthorizationResult | null> {
    // TODO: Apple Sign In 구현
    throw new Error('Apple Auth not implemented yet');
  }

  async exchangeCodeForToken(
    _authorizationCode: string,
    _codeVerifier: string,
  ): Promise<TokenResponse | null> {
    // TODO: Apple token exchange 구현
    throw new Error('Apple Auth not implemented yet');
  }

  async refreshAccessToken(
    _refreshToken: string,
  ): Promise<RefreshTokenResponse | null> {
    // TODO: Apple token refresh 구현
    throw new Error('Apple Auth not implemented yet');
  }

  async revokeToken(_accessToken: string): Promise<boolean> {
    // TODO: Apple token revoke 구현
    throw new Error('Apple Auth not implemented yet');
  }

  decodeIdToken(_idToken: string): UserInfo | null {
    // TODO: Apple ID Token decode 구현
    throw new Error('Apple Auth not implemented yet');
  }
}
