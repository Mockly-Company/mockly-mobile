// import { apiClient } from '../client';

type DeleteUserSubscriptionResponseDto = { isSuccess: true };

export async function deleteUserSubscription() {
  //   const response = await apiClient.delete<DeleteUserSubscriptionResponseDto>('/payments/');
  const response = await deleteMockPlanResponse();
  return response.data;
}
const deleteMockPlanResponse = () => {
  return Promise.resolve(mockResponse);
};

const mockResponse: { data: DeleteUserSubscriptionResponseDto } = {
  data: { isSuccess: true },
};
