import { tw } from '@mockly/design-system';

import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { Suspense } from 'react';
import { SubscriptionPayment } from '@features/payment/components/SubscriptionPayment';
import { PaymentParamList } from '@app/navigation/types';
import { SuspenseFallback } from '@app/components/Fallback/SuspenseFallback';
import { useUserProfile } from '@features/user';

type PaymentScreenProps = StackScreenProps<
  PaymentParamList,
  'SubscriptionPayment'
>;
export const SubscriptionPaymentScreen = ({
  route,
  navigation,
}: PaymentScreenProps) => {
  const { user } = useUserProfile();
  const { paymentUid, amount, orderName, billingPeriod, currency, planType } =
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
          paymentId={paymentUid}
          onError={error => {
            navigation.popTo('PaymentFail');
            Alert.alert('실패', error.message);
          }}
          onComplete={complete => {
            const pgCode = complete.pgCode;
            if (pgCode === 'CANCEL') {
              navigation.pop();
            } else {
              navigation.popTo('PaymentSuccess');
            }
          }}
        />
      </Suspense>
    </SafeAreaView>
  );
};
