import { AuthUser, type AuthProvider as AllAuthProvider } from '@mockly/domain';
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

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
}
