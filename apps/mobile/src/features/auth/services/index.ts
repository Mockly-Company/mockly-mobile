/**
 * Auth Service Factory
 * Provider에 따라 적절한 AuthService 인스턴스 반환
 */

import type { AuthProvider } from '../types';
import { BaseAuthService } from './BaseAuthService';
import { GoogleAuthService } from './GoogleAuthService';
import { AppleAuthService } from './AppleAuthService';

// Provider별 AuthService 싱글톤 인스턴스
const authServiceInstances = new Map<AuthProvider, BaseAuthService>();

/**
 * Provider에 맞는 AuthService 인스턴스 반환
 * 싱글톤 패턴으로 동일한 provider는 같은 인스턴스 재사용
 */
export function getAuthService(provider: AuthProvider): BaseAuthService {
  // 이미 생성된 인스턴스가 있으면 재사용
  if (authServiceInstances.has(provider)) {
    return authServiceInstances.get(provider)!;
  }

  // Provider에 따라 새 인스턴스 생성
  let service: BaseAuthService;

  switch (provider) {
    case 'google':
      service = new GoogleAuthService();
      break;
    case 'apple':
      service = new AppleAuthService();
      break;
    case 'naver':
      throw new Error('Naver Auth not implemented yet');
    case 'kakao':
      throw new Error('Kakao Auth not implemented yet');
    default:
      throw new Error(`Unknown auth provider: ${provider}`);
  }

  // 인스턴스 캐싱
  authServiceInstances.set(provider, service);
  return service;
}

/**
 * 테스트용: 인스턴스 캐시 초기화
 */
export function clearAuthServiceCache(): void {
  authServiceInstances.clear();
}

export { BaseAuthService } from './BaseAuthService';
export { GoogleAuthService } from './GoogleAuthService';
export { AppleAuthService } from './AppleAuthService';
