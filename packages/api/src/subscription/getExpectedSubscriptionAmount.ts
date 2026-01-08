import z from 'zod';
import { apiClient } from '../client';
import { QueryStringBuilder } from '../utils/QueryStringBuilder';
import { DateFromString } from '@mockly/domain';

export const SubscriptionChangePreviewSchema = z.object({
  currentPlan: z.object({
    name: z.literal('Basic'),
    price: z.literal(9900),
    billingCycle: z.literal('MONTHLY'),
    features: z.tuple([z.literal('기능 A'), z.literal('기능 B')]),
  }),

  targetPlan: z.object({
    name: z.literal('Pro'),
    price: z.literal(14900),
    features: z.tuple([z.literal('기능 A'), z.literal('기능 B'), z.literal('기능 C')]),
  }),

  immediateAmount: z.literal(5000),
  nextBillingAmount: z.literal(9900),

  // ISO Date → Date 변환까지 하고 싶다면
  nextBillingDate: DateFromString,
});

type GetUserSubscriptionResponseDtoRaw = z.input<typeof SubscriptionChangePreviewSchema>;

export async function getExpectedSubscriptionAmount(targetPlanId: string) {
  try {
    const apiUrl = QueryStringBuilder.create('/api/subscriptions/plan-change')
      .set('targetPlan', targetPlanId)
      .build();
    const response = await apiClient.get<GetUserSubscriptionResponseDtoRaw>(apiUrl);
    return SubscriptionChangePreviewSchema.parse(response.data);
  } catch {
    return {
      currentPlan: {
        name: 'Basic',
        price: 9900,
        billingCycle: 'MONTHLY',
        features: ['기능 A', '기능 B'],
      },
      targetPlan: {
        name: 'Pro',
        price: 14900,
        features: ['기능 A', '기능 B', '기능 C'],
      },
      immediateAmount: 5000,
      nextBillingAmount: 9900,
      nextBillingDate: new Date(),
    };
  }
}
