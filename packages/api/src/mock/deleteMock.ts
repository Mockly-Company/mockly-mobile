import { apiClient } from '../client';

export async function deleteMock(mockId: string): Promise<void> {
  await apiClient.delete<void>(`/mocks/${mockId}`);
}
