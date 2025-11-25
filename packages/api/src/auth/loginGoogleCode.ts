import { AuthToken } from '@mockly/entities';
import { apiClient } from '../client';
import { calculateExpiresAt } from './utils';

interface GoogleLoginReqDTO {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

interface TokenResDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  expiresIn: number;
}

export async function loginGoogleCode(data: GoogleLoginReqDTO): Promise<AuthToken> {
  const res = await apiClient.post<TokenResDTO>('/api/auth/login/google/code', data);

  return {
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
    user: res.data.user,
    expiresAt: calculateExpiresAt(res.timestamp, res.data.expiresIn),
  };
}
