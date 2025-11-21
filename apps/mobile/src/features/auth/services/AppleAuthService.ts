/**
 * Apple OAuth 인증 서비스 구현 (준비)
 * BaseAuthService를 상속받아 Apple 전용 로직 구현
 */

import { AccessRefreshToken, AuthToken } from '@mockly/entities';
import { BaseAuthService } from './BaseAuthService';
import type { AuthConfig, AuthorizationResult } from '../types';

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
  ): Promise<AuthToken | null> {
    // TODO: Apple token exchange 구현
    throw new Error('Apple Auth not implemented yet');
  }

  async refreshAccessToken(
    _refreshToken: string,
  ): Promise<AccessRefreshToken | null> {
    // TODO: Apple token refresh 구현
    throw new Error('Apple Auth not implemented yet');
  }

  async revokeToken(_accessToken: string): Promise<boolean> {
    // TODO: Apple token revoke 구현
    throw new Error('Apple Auth not implemented yet');
  }
}
