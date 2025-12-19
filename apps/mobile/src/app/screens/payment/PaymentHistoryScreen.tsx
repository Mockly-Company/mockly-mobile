import { View, FlatList } from 'react-native';
import { tw, Text, Spacer } from '@mockly/design-system';

import { Suspense, useMemo } from 'react';

import { PaymentHistoryCard } from './components/PaymentHistoryCard';

import { queries } from '@configs/queryClient/QueryKeys';
import { useSuspensePagingQuery } from '@hooks/usePagingQuery';
import { useRefreshControl } from '@hooks/useRefreshControl';
import { SuspenseFallback } from '@app/components/Fallback/SuspenseFallback';

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

const PaymentHistories = () => {
  const { data: paymentHistories, refetch } = useSuspensePagingQuery({
    ...queries.payment.list(10),
    gcTime: 0,
    staleTime: 0,
  });
  const RefreshControl = useRefreshControl(async () => {
    await refetch();
  });
  const payments = useMemo(
    () => paymentHistories.pages.flatMap(page => page.payments),
    [paymentHistories],
  );

  const noHistory = paymentHistories.pages.length === 0;
  if (noHistory) return <NoHistory />;

  return (
    <FlatList
      data={payments}
      style={tw`flex-1 px-4`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`pb-8`}
      refreshControl={RefreshControl}
      keyExtractor={item => item.id}
      renderItem={payment => <PaymentHistoryCard payment={payment.item} />}
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
