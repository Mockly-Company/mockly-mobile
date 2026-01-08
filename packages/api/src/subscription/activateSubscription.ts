// import { apiClient } from '../client';

import { apiClient } from '../client';

export type ActivateSubscriptionProps = {
  subscriptionId: string;
};

type ActivateSubscriptionResponseDto = {
  subscriptionId: string;
  status: 'active';
  currentPeriodStartAt: string;
  currentPeriodEndAt: string;
};

export async function ActivateUserSubscription({ subscriptionId }: ActivateSubscriptionProps) {
  const response = await apiClient.post<ActivateSubscriptionResponseDto>(
    `/api/subscriptions/${subscriptionId}/activate`
  );

  return response.data;
}
