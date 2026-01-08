import { Payment } from '@mockly/domain';
import { apiClient } from '../client';

type GetPaymentResponseDto = Payment;
// type a = Payment['plan'];
export async function getPaymentDetail(paymentId: string) {
  return (await apiClient.get<GetPaymentResponseDto>(`/api/payments/${paymentId}`)).data;
}
