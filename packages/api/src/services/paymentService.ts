import { PaymentDetail, PaymentHistory, PaymentStatus } from '@mockly/entities';
import { ApiClient } from '../client';

export interface PaymentHistoryParams {
  page?: number;
  pageSize?: number;
  status?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
}

export class PaymentService {
  constructor(private client: ApiClient) {}

  async getPaymentHistory(params?: PaymentHistoryParams): Promise<PaymentHistory> {
    return this.client.get<PaymentHistory>('/payments/history', {
      params: {
        ...params,
        startDate: params?.startDate?.toISOString(),
        endDate: params?.endDate?.toISOString(),
      },
    });
  }

  async getPayment(paymentId: string): Promise<PaymentDetail> {
    return this.client.get<PaymentDetail>(`/payments/${paymentId}`);
  }

  async getUserPayments(userId: string, params?: PaymentHistoryParams): Promise<PaymentHistory> {
    return this.client.get<PaymentHistory>(`/users/${userId}/payments`, {
      params: {
        ...params,
        startDate: params?.startDate?.toISOString(),
        endDate: params?.endDate?.toISOString(),
      },
    });
  }
}
