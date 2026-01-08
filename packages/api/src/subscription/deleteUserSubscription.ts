import { apiClient } from '../client';

type DeleteUserSubscriptionResponseDto = { isSuccess: true };

export async function deleteUserSubscription() {
  const response = await apiClient.delete<DeleteUserSubscriptionResponseDto>('/payments/', {
    data: {
      immediate: false,
    },
  });

  return response.success;
}
