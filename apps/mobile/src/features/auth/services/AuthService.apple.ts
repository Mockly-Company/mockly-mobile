/**
 * Apple OAuth 인증 서비스 구현 (준비)
 * BaseAuthService를 상속받아 Apple 전용 로직 구현
 */

import { BaseAuthService } from './BaseAuthService';
import type { AuthConfig, AuthorizationResult } from '../types';
import { AppError, ErrorCoverage } from '@errors/AppError';

const config: AuthConfig = {
  issuer: 'https://appleid.apple.com',
  clientId: 'com.mockly.mobile', // 추후 환경 변수로 이동
  redirectUrl: 'https://mockly.com/auth/apple/callback',
  scopes: ['email', 'name'],
};
// TODO: AuthService 확장시 구현 필요
export class AppleAuthService extends BaseAuthService {
  constructor() {
    super(config);
  }

  async authorize(): Promise<AuthorizationResult | null> {
    // TODO: Apple Sign In 구현
    throw new AppError(
      'Apple Auth not implemented yet',
      ErrorCoverage.NONE,
      'Apple 로그인은 아직 지원되지 않습니다',
    );
  }
}
