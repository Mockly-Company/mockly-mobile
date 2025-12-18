import { type AuthProvider as AllAuthProvider } from '@mockly/domain';
export type AuthProvider = Extract<
  AllAuthProvider,
  'google' | 'kakao' | 'apple' | 'naver' | 'github'
>;

export interface AuthConfig {
  issuer: string;
  clientId: string;
  redirectUrl: string;
  scopes: string[];
}

export interface AuthorizationResult {
  authorizationCode: string;
  codeVerifier: string;
}
