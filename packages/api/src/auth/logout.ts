import { apiClient } from '../client';

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post<void>('/api/auth/logout', {
    refreshToken,
  });
}
