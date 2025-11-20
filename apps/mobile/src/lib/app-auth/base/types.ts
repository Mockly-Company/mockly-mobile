/**
 * 모든 인증 서비스가 따라야 하는 공통 타입 정의
 */

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

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  photo: string;
  emailVerified: boolean;
}
