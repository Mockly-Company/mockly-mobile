import { apiClient } from '../client';

export async function logout(): Promise<void> {
  await apiClient.post<void>('/api/auth/logout');
}
