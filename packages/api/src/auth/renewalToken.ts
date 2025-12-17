import { AccessRefreshToken, DeviceInfo } from '@mockly/domain';
import { apiClient } from '../client';
interface RenewalTokenResDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function renewalToken(
  refreshToken: string,
  deviceInfo: DeviceInfo
): Promise<AccessRefreshToken> {
  const res = await apiClient.post<RenewalTokenResDTO>('/api/auth/refresh', {
    refreshToken,
    deviceInfo,
  });

  return res.data;
}
