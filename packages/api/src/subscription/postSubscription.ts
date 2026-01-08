// import { apiClient } from '../client';

import { apiClient } from '../client';

export type PostSubscriptionProps = {
  plan: {
    id: number;
    expectedPrice: number;
  };
  billingKey: string;
};

type PostSubscriptionResponseDto = null;

export async function postSubscription({ plan, billingKey }: PostSubscriptionProps) {
  const response = await apiClient.post<PostSubscriptionResponseDto>(`/api/subscriptions`, {
    planId: plan.id,
    expectedPrice: plan.expectedPrice,
    billingKey,
  });

  return response.success;
}
