import { apiClient } from '../client';

interface PostPaymentUIdResponseDto {
  paymentUid: string;
  expiredAt: string;
}

interface PostPaymentUIdRequestDto {
  orderId: string;
  planId: string;
  amount: number;
}

export async function postPaymentUId(
  req: PostPaymentUIdRequestDto
): Promise<PostPaymentUIdResponseDto> {
  const response = await apiClient.post<PostPaymentUIdResponseDto>('/api/payments/uid', {
    req,
  });
  return response.data;
}
