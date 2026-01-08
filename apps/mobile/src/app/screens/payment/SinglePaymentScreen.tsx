import { tw } from '@mockly/design-system';

import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { MockProducts } from '@mockly/domain';
import { Suspense } from 'react';
import { PaymentParamList } from '@app/navigation/types';
import { SinglePayment } from '@features/payment';
import { useUserProfile } from '@features/user';
import { SuspenseFallback } from '@app/components/Fallback/SuspenseFallback';

type PaymentScreenProps = StackScreenProps<PaymentParamList, 'SinglePayment'>;

export const SinglePaymentScreen = ({
  route,
  navigation,
}: PaymentScreenProps) => {
  const { user } = useUserProfile();
  const { planType } = route.params;
  const product = MockProducts[planType];

  return (
    <SafeAreaView style={tw`flex-1 justify-center`}>
      <Suspense fallback={<SuspenseFallback />}>
        <SinglePayment
          user={user}
          product={product}
          onError={() => {
            navigation.popTo('PaymentFail');
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
