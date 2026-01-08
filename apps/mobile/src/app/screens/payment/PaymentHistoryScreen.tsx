import { View, FlatList } from 'react-native';
import { tw, Text, Spacer } from '@mockly/design-system';

import { Suspense, useMemo } from 'react';

import { PaymentHistoryCard } from './components/PaymentHistoryCard';

import { queries } from '@configs/queryClient/QueryKeys';
import { useSuspensePagingQuery } from '@hooks/usePagingQuery';
import { useRefreshControl } from '@hooks/useRefreshControl';
import { SuspenseFallback } from '@app/components/Fallback/SuspenseFallback';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { PaymentParamList } from '@app/navigation/types';

export function PaymentHistoryScreen() {
  return (
    <View style={tw`flex-1`}>
      <Spacer size="lg" />
      <Suspense fallback={<SuspenseFallback />}>
        <PaymentHistories />
      </Suspense>
    </View>
  );
}

type PaymentNavigationProp = StackNavigationProp<PaymentParamList>;

const PaymentHistories = () => {
  const navigation = useNavigation<PaymentNavigationProp>();
  const { data: paymentPages, refetch } = useSuspensePagingQuery({
    ...queries.payment.list({ size: 10 }),
  });
  const RefreshControl = useRefreshControl(async () => {
    await refetch();
  });

  const payments = useMemo(
    () => paymentPages.pages.flatMap(page => page.payments),
    [paymentPages],
  );

  const noHistory = payments.length === 0;
  if (noHistory) return <NoHistory />;

  return (
    <FlatList
      data={payments}
      style={tw`flex-1 px-4`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`pb-8`}
      refreshControl={RefreshControl}
      keyExtractor={item => item.id}
      renderItem={payment => (
        <PaymentHistoryCard
          payment={payment.item}
          onPress={() =>
            navigation.navigate('PaymentInvoice', {
              paymentId: payment.item.id,
            })
          }
        />
      )}
    />
  );
};

const NoHistory = () => (
  <View style={tw`flex-1 justify-center items-center py-20`}>
    <Text variant="body" style={tw`text-gray-500 text-center`}>
      결제 내역이 없습니다.
    </Text>
  </View>
);
