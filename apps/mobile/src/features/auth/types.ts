/**
 * 인증 관련 공통 타입 정의
 * 여러 로그인 제공자(Google, Apple, Naver 등)를 지원하기 위한 추상화된 타입
 */

export type AuthProvider = 'google' | 'apple' | 'naver' | 'kakao';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  photo?: string | null;
  provider: AuthProvider;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
