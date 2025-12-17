import { PaidPlanType } from '@mockly/domain';
// import { apiClient } from '../client';

export type PatchUserSubscriptionProps = {
  plan: PaidPlanType;
};

type PatchUserSubscriptionResponseDto = {
  isSuccess: boolean;
};

export async function patchUserSubscription({ plan }: PatchUserSubscriptionProps) {
  //   const response = await apiClient.patch<PatchUserSubscriptionResponseDto>('/payments');

  const response = await getMockPlanResponse(plan);
  return response.data;
}

const getMockPlanResponse = (_newPlan: PaidPlanType) => {
  return Promise.resolve(mockResponse);
};

const mockResponse: { data: PatchUserSubscriptionResponseDto } = {
  data: { isSuccess: true },
};
