import { View, TouchableOpacity } from 'react-native';
import { tw, Text, Card, Badge } from '@mockly/design-system';
import { PaymentStatus, PaymentService, PaymentListItem } from '@mockly/domain';
import dayjs from 'dayjs';

interface PaymentHistoryItemProps {
  payment: PaymentListItem;
  onPress?: () => void;
}

export function PaymentHistoryCard({
  payment,
  onPress,
}: PaymentHistoryItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <Card style={tw`mb-3 p-4`}>
        <View style={tw`flex-row justify-between items-start mb-2`}>
          <Text variant="h4" style={tw`flex-1`}>
            {payment.id}
          </Text>
          <Badge color={statusMap[payment.status]}>
            {statusTextMap[payment.status]}
          </Badge>
        </View>

        <View style={tw`flex-row justify-between items-center mt-2`}>
          <Text variant="body" color="textSecondary">
            {dayjs(payment.paidAt).format('YYYY. MM. DD. A H:mm')}
          </Text>
          <Text variant="h4" color="secondary">
            {PaymentService.formatAmount(payment.amount, 'KRW')}
          </Text>
        </View>
        <Text variant="caption" color="secondary" style={tw`mt-2`}>
          영수증 보기
        </Text>
      </Card>
    </TouchableOpacity>
  );
}

const statusTextMap: Record<PaymentStatus, string> = {
  [PaymentStatus.enum.PENDING]: '결제 대기',
  [PaymentStatus.enum.PAID]: '결제 완료',
  [PaymentStatus.enum.FAILED]: '결제 실패',
  [PaymentStatus.enum.REFUNDED]: '환불 완료',
  [PaymentStatus.enum.CANCELLED]: '결제 취소',
};
const statusMap = {
  [PaymentStatus.enum.PAID]: 'success',
  [PaymentStatus.enum.PENDING]: 'neutral',
  [PaymentStatus.enum.FAILED]: 'error',
  [PaymentStatus.enum.REFUNDED]: 'warning',
  [PaymentStatus.enum.CANCELLED]: 'neutral',
} as const;
