import { Subscription, SubscriptionPayment, SubscriptionPaymentResult } from '@mockly/entities';
import { ApiClient } from '../client';

export interface IamportPaymentRequest {
  merchant_uid: string;
  amount: number;
  name: string;
  buyer_email?: string;
  buyer_name?: string;
  buyer_tel?: string;
}

export interface IamportPaymentResponse {
  success: boolean;
  imp_uid?: string;
  merchant_uid?: string;
  error_msg?: string;
}

export class SubscriptionService {
  constructor(private client: ApiClient) {}

  async getCurrentSubscription(): Promise<Subscription | null> {
    return this.client.get<Subscription | null>('/subscriptions/current');
  }

  async getSubscriptionHistory(): Promise<Subscription[]> {
    return this.client.get<Subscription[]>('/subscriptions/history');
  }

  async initiateSubscriptionPayment(payment: SubscriptionPayment): Promise<IamportPaymentRequest> {
    return this.client.post<IamportPaymentRequest>('/subscriptions/payment/initiate', payment);
  }

  async completeSubscriptionPayment(
    iamportResponse: IamportPaymentResponse
  ): Promise<SubscriptionPaymentResult> {
    return this.client.post<SubscriptionPaymentResult>(
      '/subscriptions/payment/complete',
      iamportResponse
    );
  }

  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    return this.client.post<Subscription>(`/subscriptions/${subscriptionId}/cancel`);
  }

  async updateSubscription(
    subscriptionId: string,
    data: Partial<Subscription>
  ): Promise<Subscription> {
    return this.client.put<Subscription>(`/subscriptions/${subscriptionId}`, data);
  }
}
