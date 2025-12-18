import { z } from 'zod';
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AccessRefreshToken {
  accessToken: string;
  refreshToken: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
}

export const AuthProviderSchema = z.enum(['google', 'apple', 'naver', 'kakao', 'github']);

export type AuthProvider = z.infer<typeof AuthProviderSchema>;
