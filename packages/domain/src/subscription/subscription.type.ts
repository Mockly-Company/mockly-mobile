import z from 'zod';
import { PaidPlanType, PlanType } from '../product';

/** FREE 플랜 */
export const FreeSubscriptionSchema = z.object({
  type: z.literal('Free'),
  planSnapshot: z.object({
    name: z.literal(PlanType.enum.Free),
    price: z.literal('0'),
  }),
});

export const PaidSubscriptionSchema = z.object({
  type: z.literal('Paid'),
  subscriptionId: z.string(),
  status: z.enum(['Active', 'Inactive', 'Canceled']),
  planSnapshot: z.object({
    name: PaidPlanType,
    price: z.string(),
    billingCycle: z.enum(['Monthly', 'Yearly']),
    features: z.array(z.string()),
  }),
  startedAt: z.date(),
  endedAt: z.date(),
  nextBillingDate: z.date(),
  nextBillingAmount: z.number(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.date().nullable(),
});

/** 최종 스키마 */
export const SubscriptionSchema = z.discriminatedUnion('type', [
  FreeSubscriptionSchema,
  PaidSubscriptionSchema,
]);

export type Subscription = z.infer<typeof SubscriptionSchema>;
export type PaidSubscription = z.infer<typeof PaidSubscriptionSchema>;
export type FreeSubscription = z.infer<typeof FreeSubscriptionSchema>;

export function validateUserSubscription(data: unknown): Subscription {
  return SubscriptionSchema.parse(data);
}
