import { apiClient } from '../client';

export async function revokeGoogleToken(): Promise<void> {
  await apiClient.post<void>('/auth/google/revoke');
}
