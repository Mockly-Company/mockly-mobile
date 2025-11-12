export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  price: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPayment {
  subscriptionId: string;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  paymentMethodId?: string;
}

export interface SubscriptionPaymentResult {
  success: boolean;
  subscriptionId?: string;
  transactionId?: string;
  error?: string;
}
