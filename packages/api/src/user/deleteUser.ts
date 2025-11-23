import { apiClient } from '../client';

export async function deleteUser(userId: string): Promise<void> {
  await apiClient.delete<void>(`/users/${userId}`);
}
