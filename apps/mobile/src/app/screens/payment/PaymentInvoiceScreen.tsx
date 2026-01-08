import { View, ScrollView } from 'react-native';
import { tw, Text, Card, Badge } from '@mockly/design-system';
import { Suspense } from 'react';
import { SuspenseFallback } from '@app/components/Fallback/SuspenseFallback';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { PaymentParamList } from '@app/navigation/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '@configs/queryClient/QueryKeys';
import { PaymentService, PaymentStatus } from '@mockly/domain';
import dayjs from 'dayjs';

type PaymentInvoiceRouteProp = RouteProp<PaymentParamList, 'PaymentInvoice'>;

export function PaymentInvoiceScreen() {
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <Suspense fallback={<SuspenseFallback />}>
        <PaymentInvoice />
      </Suspense>
    </View>
  );
}

const PaymentInvoice = () => {
  const route = useRoute<PaymentInvoiceRouteProp>();
  const { paymentId } = route.params;

  const { data: invoice } = useSuspenseQuery(
    queries.payment.invoice(paymentId),
  );

  const isPaid = invoice.status === PaymentStatus.enum.PAID;
  const taxRate = 0.1; // 10% VAT
  const subtotal = invoice.amount;
  const tax = Math.round(subtotal * taxRate);
  const totalExcludingTax = subtotal;
  const total = subtotal + tax;

  const billingPeriodStart = dayjs(invoice.startedAt);
  const billingPeriodEnd = invoice.endedAt
    ? dayjs(invoice.endedAt)
    : billingPeriodStart.add(1, 'month');

  return (
    <ScrollView
      style={tw`flex-1`}
      contentContainerStyle={tw`p-4`}
      showsVerticalScrollIndicator={false}
    >
      {/* Invoice Header */}
      <Card style={tw`p-6 mb-4`}>
        <View style={tw`flex-row justify-between items-start mb-6`}>
          <View>
            <Text variant="h2" style={tw`mb-2`}>
              청구서
            </Text>
            <Text variant="body" color="textSecondary">
              Invoice
            </Text>
          </View>
          <Badge color={isPaid ? 'success' : 'warning'}>
            {isPaid ? '결제 완료' : '결제 대기'}
          </Badge>
        </View>

        {/* Invoice Details */}
        <View style={tw`mb-4`}>
          <InfoRow label="청구서 번호" value={invoice.id} />
          <InfoRow
            label="발행일"
            value={dayjs(invoice.paidAt).format('YYYY년 M월 D일')}
          />
          <InfoRow
            label="결제 기한"
            value={dayjs(invoice.paidAt).format('YYYY년 M월 D일')}
          />
        </View>

        {/* Company Info */}
        <View style={tw`border-t border-gray-200 pt-4 mb-4`}>
          <Text variant="h4" style={tw`mb-2`}>
            Mockly, Inc.
          </Text>
          <Text variant="caption" color="textSecondary">
            서울특별시 금천구 금하로 793
          </Text>
          <Text variant="caption" color="textSecondary">
            08665
          </Text>
          <Text variant="caption" color="textSecondary">
            South Korea
          </Text>
          <Text variant="caption" color="textSecondary" style={tw`mt-1`}>
            support@mockly.com
          </Text>
        </View>
      </Card>

      {/* Amount Due */}
      <Card style={tw`p-6 mb-4`}>
        <Text variant="body" color="textSecondary" style={tw`mb-2`}>
          {isPaid ? '결제 금액' : '납부 예정 금액'}
        </Text>
        <Text variant="h1" color="primary">
          {PaymentService.formatAmount(total, invoice.currency)}
        </Text>
        {isPaid && (
          <Text variant="caption" color="textSecondary" style={tw`mt-2`}>
            {dayjs(invoice.paidAt).format('YYYY년 M월 D일')} 결제 완료
          </Text>
        )}
      </Card>

      {/* Line Items */}
      <Card style={tw`p-6 mb-4`}>
        <Text variant="h4" style={tw`mb-4`}>
          상세 내역
        </Text>

        {/* Table Header */}
        <View style={tw`flex-row pb-3 border-b border-gray-200`}>
          <Text
            variant="caption"
            color="textSecondary"
            style={tw`flex-1 font-bold`}
          >
            설명
          </Text>
          <Text
            variant="caption"
            color="textSecondary"
            style={tw`w-16 text-center font-bold`}
          >
            수량
          </Text>
          <Text
            variant="caption"
            color="textSecondary"
            style={tw`w-20 text-right font-bold`}
          >
            금액
          </Text>
        </View>

        {/* Line Item */}
        <View style={tw`py-4 border-b border-gray-100`}>
          <View style={tw`flex-row`}>
            <View style={tw`flex-1`}>
              <Text variant="body" style={tw`mb-1`}>
                구독 서비스
              </Text>
              <Text variant="caption" color="textSecondary">
                {billingPeriodStart.format('YYYY년 M월 D일')} –{' '}
                {billingPeriodEnd.format('M월 D일')}
              </Text>
            </View>
            <Text variant="body" style={tw`w-16 text-center`}>
              1
            </Text>
            <Text variant="body" style={tw`w-20 text-right`}>
              {PaymentService.formatAmount(subtotal, invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={tw`mt-4`}>
          <SummaryRow
            label="소계"
            value={PaymentService.formatAmount(
              totalExcludingTax,
              invoice.currency,
            )}
          />
          <SummaryRow
            label="총 금액 (세전)"
            value={PaymentService.formatAmount(
              totalExcludingTax,
              invoice.currency,
            )}
          />
          <SummaryRow
            label={`VAT - South Korea (10% on ${PaymentService.formatAmount(totalExcludingTax, invoice.currency)})`}
            value={PaymentService.formatAmount(tax, invoice.currency)}
          />
          <View style={tw`border-t-2 border-gray-300 pt-3 mt-3`}>
            <SummaryRow
              label="합계"
              value={PaymentService.formatAmount(total, invoice.currency)}
              isTotal
            />
          </View>
          <View style={tw`border-t border-gray-200 pt-3 mt-3`}>
            <SummaryRow
              label={isPaid ? '결제 금액' : '납부 예정 금액'}
              value={`${PaymentService.formatAmount(total, invoice.currency)} ${invoice.currency}`}
              isTotal
            />
          </View>
        </View>
      </Card>

      {/* Footer */}
      <Card style={tw`p-6 mb-8`}>
        <Text variant="caption" color="textSecondary" style={tw`text-center`}>
          문의사항이 있으시면 고객센터로 연락주세요.
        </Text>
        <Text
          variant="caption"
          color="textSecondary"
          style={tw`text-center mt-1`}
        >
          support@mockly.com
        </Text>
      </Card>
    </ScrollView>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <View style={tw`flex-row justify-between py-2`}>
    <Text variant="body" color="textSecondary">
      {label}
    </Text>
    <Text variant="body">{value}</Text>
  </View>
);

interface SummaryRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

const SummaryRow = ({ label, value, isTotal }: SummaryRowProps) => (
  <View style={tw`flex-row justify-between py-2`}>
    <Text
      variant={isTotal ? 'h4' : 'body'}
      color={isTotal ? 'text' : 'textSecondary'}
    >
      {label}
    </Text>
    <Text variant={isTotal ? 'h4' : 'body'}>{value}</Text>
  </View>
);
