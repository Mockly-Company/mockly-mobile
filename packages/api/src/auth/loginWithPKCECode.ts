import { AuthToken, LocationInfo, DeviceInfo, AuthProvider } from '@mockly/entities';
import { apiClient } from '../client';

interface GoogleLoginReqDTO {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  deviceInfo: DeviceInfo;
  locationInfo: LocationInfo;
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

export async function loginWithPKCECode(
  data: GoogleLoginReqDTO,
  provider: AuthProvider
): Promise<AuthToken> {
  const res = await apiClient.post<TokenResDTO>(`/api/auth/login/${provider}/code`, data);
  return {
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
    user: res.data.user,
  };
}
