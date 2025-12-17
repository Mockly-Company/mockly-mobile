import { apiClient } from '../client';

interface PostPaymentBillKeyRequestDTO {
  paymentUid: string;
  billingKey: string;
  amount: number;
  orderName: string;
  customerId: string;
}

interface PostPaymentBillKeyResponseDTO {
  uid: string;
}

export async function postPaymentBillKey(req: PostPaymentBillKeyRequestDTO): Promise<string> {
  const response = await apiClient.post<PostPaymentBillKeyResponseDTO>(
    '/api/payments/billing-key',
    req
  );

  return response.data.uid;
}
