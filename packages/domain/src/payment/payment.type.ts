import { z } from 'zod';

export const CURRENCY = z.enum(['KRW', 'USD']);
export type CURRENCY = z.infer<typeof CURRENCY>;

export const PaymentStatus = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED']);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

// 결제 내역
export const PaymentHistorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  planName: z.string(),
  amount: z.number(),
  currency: CURRENCY,
  status: PaymentStatus,
  paidAt: z.date().optional(),
  receiptUrl: z.string().optional(),
});

export type PaymentHistory = z.infer<typeof PaymentHistorySchema>;
