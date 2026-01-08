import z from 'zod';
import { CURRENCY } from '../payment';

// Plan Type 정의
export const PlanType = z.enum(['Free', 'Basic', 'Pro', 'Premium']);
export const PaidPlanType = z.enum(['Basic', 'Pro', 'Premium']);
export type PlanType = z.infer<typeof PlanType>;
export type PaidPlanType = z.infer<typeof PaidPlanType>;

export const SubscriptionProduct = z.object({
  id: z.number(),
  name: z.string(),
  planType: PlanType,
  price: z.number(),
  currency: CURRENCY,
  billingPeriod: z.number(),
});

const PaidSubscriptionProduct = z.object({
  id: z.number(),
  name: z.string(),
  planType: PaidPlanType,
  price: z.number(),
  currency: CURRENCY,
  billingPeriod: z.number(),
});

export type SubscriptionProduct = z.infer<typeof SubscriptionProduct>;
export type PaidSubscriptionProduct = z.infer<typeof PaidSubscriptionProduct>;

export const MockProducts: Record<PaidPlanType, PaidSubscriptionProduct> = {
  Basic: {
    id: 1,
    name: '베이직 플랜',
    planType: 'Basic',
    price: 4900,
    currency: 'KRW',
    billingPeriod: 1,
  },
  Pro: {
    id: 2,
    name: '프로 플랜',
    planType: 'Pro',
    price: 9900,
    currency: 'KRW',
    billingPeriod: 1,
  },
  Premium: {
    id: 3,
    name: '프리미엄 플랜',
    planType: 'Premium',
    price: 14900,
    currency: 'KRW',
    billingPeriod: 1,
  },
};
