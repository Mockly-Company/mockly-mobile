/**
 * 모든 인증 서비스의 추상 클래스
 * Provider별로 이 클래스를 상속받아 구현
 */

import { AccessRefreshToken, AuthToken } from '@mockly/entities';
import type { AuthConfig, AuthorizationResult } from '../types';

export abstract class BaseAuthService {
  protected config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  /**
   * PKCE를 사용한 인증 시작
   * Authorization Code와 Code Verifier 반환
   */
  abstract authorize(): Promise<AuthorizationResult | null>;

  /**
   * Authorization Code를 백엔드로 전송하여 토큰 교환
   */
  abstract exchangeCodeForToken(
    authorizationCode: string,
    codeVerifier: string,
  ): Promise<AuthToken | null>;

  /**
   * Refresh Token으로 새 Access Token 발급
   */
  abstract refreshAccessToken(
    refreshToken: string,
  ): Promise<AccessRefreshToken | null>;

  /**
   * 로그아웃 및 토큰 폐기
   */
  abstract logout(accessToken: string): Promise<boolean>;

  /**
   * 토큰 만료 여부 확인
   */
  isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt;
  }

  /**
   * 토큰이 곧 만료될지 확인 (5분 이내)
   */
  isTokenExpiringSoon(
    expiresAt: number,
    bufferMs: number = 5 * 60 * 1000,
  ): boolean {
    return Date.now() >= expiresAt - bufferMs;
  }
}
