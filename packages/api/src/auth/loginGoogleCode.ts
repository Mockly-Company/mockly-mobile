import { AuthToken } from '@mockly/entities';
import { apiClient } from '../client';

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
    ...res.data,
    expiresAt: new Date(res.timestamp * 1000 + res.data.expiresIn * 1000),
  };
}
