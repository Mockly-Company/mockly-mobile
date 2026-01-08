import { tw } from '@mockly/design-system';

import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { Suspense } from 'react';
import { SubscriptionPayment } from '@features/payment/components/SubscriptionPayment';
import { PaymentParamList } from '@app/navigation/types';
import { SuspenseFallback } from '@app/components/Fallback/SuspenseFallback';
import { useUserProfile } from '@features/user';
import { useMutation } from '@tanstack/react-query';
import { queries } from '@configs/queryClient/QueryKeys';
import api from '@mockly/api';

type PaymentScreenProps = StackScreenProps<
  PaymentParamList,
  'SubscriptionPayment'
>;
export const SubscriptionPaymentScreen = ({
  route,
  navigation,
}: PaymentScreenProps) => {
  const { user } = useUserProfile();
  const { mutateAsync: payAndSubscribe } = useMutation({
    mutationKey: queries.subscription.create().queryKey,
    mutationFn: api.subscription.postSubscription,
  });
  const { amount, orderName, billingPeriod, currency, planType, planId } =
    route.params;

  return (
    <SafeAreaView style={tw`flex-1 justify-center`}>
      <Suspense fallback={<SuspenseFallback />}>
        <SubscriptionPayment
          user={user}
          product={{
            name: orderName,
            price: amount,
            currency: currency,
            billingPeriod: billingPeriod,
            planType: planType,
          }}
          onError={() => {
            navigation.popTo('PaymentFail');
          }}
          onComplete={complete => {
            const pgCode = complete.pgCode;
            if (pgCode === 'CANCEL') {
              navigation.pop();
            } else {
              payAndSubscribe({
                plan: {
                  expectedPrice: amount,
                  id: planId,
                },
                billingKey: complete.billingKey,
              })
                .then(() => {
                  navigation.popTo('PaymentSuccess');
                })
                .catch(() => {
                  navigation.popTo('PaymentFail');
                });
            }
          }}
        />
      </Suspense>
    </SafeAreaView>
  );
};
