import { CURRENCY, DateFromString } from '@mockly/domain';
import { apiClient } from '../client';
import z from 'zod';
export const GetPaymentInvoiceSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: CURRENCY,
  status: z.literal('PAID'),
  startedAt: DateFromString,
  endedAt: DateFromString,
  paidAt: DateFromString.nullable(),
});
type GetPaymentInvoiceResponseDtoRaw = z.input<typeof GetPaymentInvoiceSchema>;

export async function getPaymentInvoice(paymentId: string) {
  try {
    const response = await apiClient.get<GetPaymentInvoiceResponseDtoRaw>(
      `/api/payments/${paymentId}/invoice`
    );

    return GetPaymentInvoiceSchema.parse(response.data);
  } catch {
    return {
      id: 'invoice-asdfc-0001',
      amount: 9900,
      currency: 'KRW',
      status: 'PAID',
      startedAt: new Date(),
      endedAt: new Date(),
      paidAt: new Date(),
    };
  }
}
