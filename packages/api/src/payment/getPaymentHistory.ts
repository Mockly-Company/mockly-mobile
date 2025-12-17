import { CURRENCY, PaymentHistory, PaymentStatus } from '@mockly/domain';
// import { apiClient } from '../client';

interface GetPaymentHistoryResponseDto {
  payments: {
    id: string;
    user_id: string;
    plan_name: string;
    amount: number;
    currency: CURRENCY;
    status: PaymentStatus;
    paid_at?: number;
    receipt_url?: string;
  }[];
  total: number;
  page: number;
  limit: number;
}
export async function getPaymentHistory(
  page: number = 1,
  limit: number = 10
): Promise<{ payments: PaymentHistory[]; total: number }> {
  // const response = await apiClient.get<GetPaymentHistoryResponseDto>(
  //   `/payments/history?page=${page}&limit=${limit}`
  // );
  const response = await new Promise<{ data: GetPaymentHistoryResponseDto }>(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          payments: mockPayments,
          total: 11,
          page: page,
          limit: limit,
        },
      });
    }, 2000);
  });

  // DTO → Entity 변환
  const payments: PaymentHistory[] = response.data.payments.map(payment => ({
    id: payment.id,
    userId: payment.user_id,
    planName: payment.plan_name,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    paidAt: payment.paid_at ? new Date(payment.paid_at) : undefined,
    receiptUrl: payment.receipt_url,
  }));

  return {
    payments,
    total: response.data.total,
  };
}

const mockPayments: {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  currency: CURRENCY;
  status: PaymentStatus;
  paid_at?: number;
  receipt_url?: string;
}[] = [
  {
    id: 'pay_001',
    user_id: 'user_123',
    plan_name: 'Premium Monthly',
    amount: 9900,
    currency: 'KRW',
    status: PaymentStatus.enum.COMPLETED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 2,
    receipt_url: 'https://example.com/receipt/001',
  },
  {
    id: 'pay_002',
    user_id: 'user_123',
    plan_name: 'Premium Yearly',
    amount: 99000,
    currency: 'KRW',
    status: PaymentStatus.enum.COMPLETED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 35,
    receipt_url: 'https://example.com/receipt/002',
  },
  {
    id: 'pay_003',
    user_id: 'user_123',
    plan_name: 'Premium Monthly',
    amount: 9900,
    currency: 'KRW',
    status: PaymentStatus.enum.FAILED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 60,
  },
  {
    id: 'pay_004',
    user_id: 'user_123',
    plan_name: 'Premium Monthly',
    amount: 9900,
    currency: 'KRW',
    status: PaymentStatus.enum.COMPLETED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 90,
    receipt_url: 'https://example.com/receipt/004',
  },
  {
    id: 'pay_005',
    user_id: 'user_123',
    plan_name: 'Premium Yearly',
    amount: 99000,
    currency: 'KRW',
    status: PaymentStatus.enum.COMPLETED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 120,
    receipt_url: 'https://example.com/receipt/005',
  },
  {
    id: 'pay_006',
    user_id: 'user_123',
    plan_name: 'Premium Monthly',
    amount: 9900,
    currency: 'KRW',
    status: PaymentStatus.enum.PENDING,
    paid_at: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'pay_007',
    user_id: 'user_123',
    plan_name: 'Premium Monthly',
    amount: 9900,
    currency: 'KRW',
    status: PaymentStatus.enum.COMPLETED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 150,
    receipt_url: 'https://example.com/receipt/007',
  },
  {
    id: 'pay_008',
    user_id: 'user_123',
    plan_name: 'Premium Yearly',
    amount: 99000,
    currency: 'KRW',
    status: PaymentStatus.enum.COMPLETED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 180,
    receipt_url: 'https://example.com/receipt/008',
  },
  {
    id: 'pay_009',
    user_id: 'user_123',
    plan_name: 'Premium Monthly',
    amount: 9900,
    currency: 'KRW',
    status: PaymentStatus.enum.CANCELLED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 210,
  },
  {
    id: 'pay_010',
    user_id: 'user_123',
    plan_name: 'Premium Monthly',
    amount: 9900,
    currency: 'KRW',
    status: PaymentStatus.enum.COMPLETED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 240,
    receipt_url: 'https://example.com/receipt/010',
  },
  {
    id: 'pay_011',
    user_id: 'user_123',
    plan_name: 'Premium Yearly',
    amount: 99000,
    currency: 'KRW',
    status: PaymentStatus.enum.COMPLETED,
    paid_at: Date.now() - 1000 * 60 * 60 * 24 * 365,
    receipt_url: 'https://example.com/receipt/011',
  },
];
