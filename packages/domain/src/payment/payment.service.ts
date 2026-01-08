import { PaymentStatus } from './payment.type';

export class PaymentService {
  // 결제 금액 포맷팅 (한국 원화 기준)
  static formatAmount(amount: number, currency: string = 'KRW'): string {
    if (currency === 'KRW') {
      return `${amount.toLocaleString('ko-KR')}원`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  }
  // 결제 상태 한글 변환
  static getPaymentStatusText(status: PaymentStatus): string {
    const statusTextMap: Record<PaymentStatus, string> = {
      [PaymentStatus.enum.PENDING]: '결제 대기',
      [PaymentStatus.enum.PAID]: '결제 완료',
      [PaymentStatus.enum.FAILED]: '결제 실패',
      [PaymentStatus.enum.CANCELLED]: '결제 취소',
      [PaymentStatus.enum.REFUNDED]: '환불 완료',
    };

    return statusTextMap[status];
  }
}
