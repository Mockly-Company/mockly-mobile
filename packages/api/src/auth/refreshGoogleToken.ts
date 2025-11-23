import { AccessRefreshToken } from '@mockly/entities';
import { apiClient } from '../client';
import { calculateExpiresAt } from './utils';

interface RefreshTokenResDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function refreshGoogleToken(refreshToken: string): Promise<AccessRefreshToken> {
  const res = await apiClient.post<RefreshTokenResDTO>('/api/auth/google/refresh', {
    refreshToken,
  });
  return {
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
    expiresAt: calculateExpiresAt(res.timestamp, res.data.expiresIn),
  };
}
