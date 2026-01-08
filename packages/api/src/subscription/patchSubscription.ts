import { Payment } from '@mockly/domain';
import { apiClient } from '../client';

export type PatchUserSubscriptionProps = {
  targetPlanId: number;
  confirmedAmount: number;
};

type PatchUserSubscriptionResponseDto = {
  chargedAmount: number;
  currency: Payment['currency'];
  requestedAt: string;
  effectiveAt: string;
  subscription: {
    status: Payment['status'];
    startedAt: string;
    endedAt: string;
    nextBillingDate: string;
    nextBillingAmount: number;
    planSnapshot: {
      name: string;
      price: number;
      billingCycle: 'MONTHLY';
      features: string[];
    };
  };
};

export async function patchUserSubscription({
  targetPlanId,
  confirmedAmount,
}: PatchUserSubscriptionProps) {
  const response = await apiClient.post<PatchUserSubscriptionResponseDto>(
    `/api/subscriptions/plan-change`,
    {
      targetPlanId: targetPlanId,
      confirmedAmount: confirmedAmount,
    }
  );

  return response.data;
}
