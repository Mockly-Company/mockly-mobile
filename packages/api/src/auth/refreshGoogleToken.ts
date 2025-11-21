import { AccessRefreshToken } from '@mockly/entities';
import { apiClient } from '../client';

interface RefreshTokenResDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function refreshGoogleToken(refreshToken: string): Promise<AccessRefreshToken> {
  const res = await apiClient.post<RefreshTokenResDTO>('/auth/google/refresh', {
    refreshToken,
  });
  return {
    ...res.data,
    expiresAt: new Date(res.timestamp * 1000 + res.data.expiresIn * 1000),
  };
}
