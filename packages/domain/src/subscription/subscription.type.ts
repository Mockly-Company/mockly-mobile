import z from 'zod';
import { PaidPlanType } from '../product';

// 사용자 구독 정보
/** 공통 필드 */
const BaseSubscriptionSchema = {
  isActive: z.boolean(),
  limit: z.number(),
  usage: z.number(),
};

/** FREE 플랜 */
const FreeSubscriptionSchema = z.object({
  planType: z.literal('FREE'),
  ...BaseSubscriptionSchema,
  startedAt: z.null(),
  expiresAt: z.null(),
});

/** 유료 플랜 */
const PaidSubscriptionSchema = z.object({
  planType: PaidPlanType,
  ...BaseSubscriptionSchema,
  startedAt: z.date(),
  expiresAt: z.date(),
});

/** 최종 스키마 */
export const SubscriptionSchema = z.discriminatedUnion('planType', [
  FreeSubscriptionSchema,
  PaidSubscriptionSchema,
]);

export type Subscription = z.infer<typeof SubscriptionSchema>;

export function validateUserSubscription(data: unknown): Subscription {
  return SubscriptionSchema.parse(data);
}
