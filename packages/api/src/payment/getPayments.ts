import { Payment, PaymentSchema } from '@mockly/domain';
import { Pageable } from '../types';
import { apiClient } from '../client';
import { QueryStringBuilder } from '../utils/QueryStringBuilder';
import z from 'zod';

type GetPaymentResponseDto = Pageable<{
  payments: PaymentListItemDTO[];
}>;
type PaymentListItemDTO = z.input<typeof PaymentSchema>;

type GetPaymentsProps = {
  queryParams: {
    page?: number;
    size?: number;
    status?: Payment['status'];
    startDate?: string;
    endDate?: string;
  };
};

export async function getPayments({ queryParams }: GetPaymentsProps) {
  const { page = 1, size = 10, status, startDate, endDate } = queryParams;
  const apiUrl = QueryStringBuilder.create('/payments/history')
    .set('page', page)
    .set('size', size)
    .set('status', status)
    .set('startDate', startDate)
    .set('endDate', endDate)
    .build();
  try {
    const res = await apiClient.get<GetPaymentResponseDto>(apiUrl);

    return {
      pagination: res.data.pagination,
      payments: res.data.payments.map(payment => PaymentSchema.parse(payment)),
      total: res.data.pagination.totalElements,
    };
  } catch {
    const payments: z.infer<typeof PaymentSchema>[] = [
      {
        id: 'pay_20251230_0001',
        amount: 9900,
        currency: 'KRW',
        status: 'PAID',
        paymentMethod: 'CARD',
        product: {
          name: 'Pro',
          price: 9900,
          billingCycle: 'MONTHLY',
        },
        paidAt: new Date(),
      },
    ];

    return {
      pagination: {
        page: 1,
        size: 10,
        totalElements: 5,
        totalPages: 1,
        isFirst: true,
        isLast: true,
      },
      payments: payments,
      total: 5,
    };
  }
}
