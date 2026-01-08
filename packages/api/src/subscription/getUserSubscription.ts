import {
  DateFromString,
  FreeSubscriptionSchema,
  PaidSubscription,
  PaidSubscriptionSchema,
  Subscription,
} from '@mockly/domain';
import { apiClient } from '../client';
import z from 'zod';
const PaidSubscriptionResponseSchema = PaidSubscriptionSchema.omit({ type: true }).extend({
  startedAt: DateFromString,
  endedAt: DateFromString,
  nextBillingDate: DateFromString,
  canceledAt: DateFromString.nullable(),
});

const FreeSubscriptionResponseSchema = FreeSubscriptionSchema.omit({ type: true });

const GetUserSubscriptionResponseDtoSchema = z.union([
  PaidSubscriptionResponseSchema,
  FreeSubscriptionResponseSchema,
]);

type GetUserSubscriptionResponseDtoRaw = z.input<typeof GetUserSubscriptionResponseDtoSchema>;
type GetUserSubscriptionResponseDto = z.infer<typeof GetUserSubscriptionResponseDtoSchema>;

export async function getUserSubscription(): Promise<Subscription> {
  // MOCK
  try {
    const response = await apiClient.get<GetUserSubscriptionResponseDtoRaw>('/api/subscriptions');
    const subscription = GetUserSubscriptionResponseDtoSchema.parse(response.data);

    if (isPaidSubscription(subscription)) {
      return {
        type: 'Paid',
        ...subscription,
      };
    }

    return {
      type: 'Free',
      ...subscription,
    };
  } catch {
    return PAID_MOCK;
  }
}

const PAID_MOCK: Subscription = {
  type: 'Paid',
  subscriptionId: 'sub_20250101_001',
  status: 'Active',
  planSnapshot: {
    name: 'Pro',
    price: '14900',
    billingCycle: 'Monthly',
    features: ['기능 A', '기능 B', '기능 C'],
  },
  startedAt: new Date('2025-01-01T00:00:00Z'),
  endedAt: new Date('2025-12-31T23:59:59Z'),
  nextBillingDate: new Date('2025-02-01T00:00:00Z'),
  nextBillingAmount: 14900,
  cancelAtPeriodEnd: false,
  canceledAt: null,
};

const isPaidSubscription = (
  subscription: GetUserSubscriptionResponseDto
): subscription is Omit<PaidSubscription, 'type'> => {
  if ('status' in subscription) {
    return true;
  }
  return false;
};
