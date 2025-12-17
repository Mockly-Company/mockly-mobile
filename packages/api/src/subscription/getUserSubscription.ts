import { PlanType, Subscription } from '@mockly/domain';

interface GetUserSubscriptionResponseDto {
  subscription: {
    plan_type: PlanType;
    is_active: boolean;
    limit: number;
    usage: number;
    started_at: number;
    expires_at: number;
  };
}

export async function getUserSubscription(userId: string): Promise<Subscription> {
  // const response = await apiClient.get<GetUserSubscriptionResponseDto>('/payments/subscription');
  const response = await getMockPlanResponse(userId);
  const { plan_type, is_active, started_at, expires_at } = response.data.subscription;

  const baseSubscription = {
    isActive: is_active,
    limit: 15000,
    usage: 15000,
  };
  const isFreePlan = plan_type === PlanType.enum.FREE;
  if (isFreePlan) {
    return {
      ...baseSubscription,
      planType: plan_type,
      startedAt: null,
      expiresAt: null,
    };
  }

  return {
    ...baseSubscription,
    planType: plan_type,
    startedAt: new Date(started_at),
    expiresAt: new Date(expires_at),
  };
}

const getMockPlanResponse = (_userId: string) => {
  return Promise.resolve(MockPlanResponse);
};

const MockPlanResponse: { data: GetUserSubscriptionResponseDto } = {
  data: {
    subscription: {
      expires_at: new Date().getTime(),
      started_at: new Date().getTime(),
      limit: 500000,
      usage: 150000,
      is_active: true,
      plan_type: 'PRO',
    },
  },
};
