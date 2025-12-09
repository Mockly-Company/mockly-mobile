import { AccessRefreshToken, LocationInfo } from '@mockly/domain';
import { apiClient } from '../client';
interface RenewalTokenResDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function renewalToken(
  refreshToken: string,
  locationInfo: LocationInfo
): Promise<AccessRefreshToken> {
  const res = await apiClient.post<RenewalTokenResDTO>('/api/auth/refresh', {
    refreshToken,
    locationInfo,
  });

  return {
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
  };
}
