// import { apiClient } from '../client';

import { PaidPlanType } from '@mockly/domain';

type PostSubscriptionOrderRequestDTO = { planType: PaidPlanType; planId: string };
type PostSubscriptionOrderResponseDTO = { orderId: string };

export async function postSubscriptionOrder(_req: PostSubscriptionOrderRequestDTO) {
  //   const response = await apiClient.delete<DeleteUserSubscriptionResponseDto>('/payments/');
  const response = await postMockSubscriptionOrder();
  return response.data;
}
const postMockSubscriptionOrder = () => {
  return Promise.resolve(mockResponse);
};

const mockResponse: { data: PostSubscriptionOrderResponseDTO } = {
  data: { orderId: 'mock-order-1234' },
};
