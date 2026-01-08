import { z } from 'zod';
import { DateFromString } from '../utils';

export const CURRENCY = z.enum(['KRW', 'USD']);
export type CURRENCY = z.infer<typeof CURRENCY>;

export const PaymentStatus = z.enum(['PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED']);
export const PaymentMethod = z.enum(['CARD', 'EASY_PAY']);
export type PaymentStatus = z.infer<typeof PaymentStatus>;
export const BillingCycle = z.enum(['MONTHLY', 'YEARLY']);

// 결제 내역
export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: CURRENCY,
  status: PaymentStatus,
  paymentMethod: PaymentMethod,
  paidAt: DateFromString.optional(),
  product: z.object({
    name: z.string(),
    price: z.number(),
    billingCycle: BillingCycle,
  }),
});

export const Invoice = z.object({
  id: z.string(),
  amount: z.number(),
  currency: CURRENCY,
  status: PaymentStatus,
  startedAt: z.date(),
  endedAt: z.date().optional(),
  paidAt: z.date().optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;
export type Invoice = z.infer<typeof Invoice>;
export type PaymentListItem = Omit<Payment, 'product'> & {
  paymentMethod: string;
};
