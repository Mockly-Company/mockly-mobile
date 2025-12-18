import { tw } from '@mockly/design-system';

import { ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { MockProducts } from '@mockly/domain';
import { Suspense } from 'react';
import { PaymentParamList } from '@app/navigation/types';
import { SinglePayment } from '@features/payment';
import { useUserProfile } from '@features/user';

type PaymentScreenProps = StackScreenProps<PaymentParamList, 'SinglePayment'>;

export const SinglePaymentScreen = ({
  route,
  navigation,
}: PaymentScreenProps) => {
  const { user } = useUserProfile();
  const { planType, paymentId } = route.params;
  const product = MockProducts[planType];

  return (
    <SafeAreaView style={tw`flex-1 justify-center`}>
      <Suspense fallback={<ActivityIndicator size={'large'} />}>
        <SinglePayment
          user={user}
          product={product}
          paymentId={paymentId}
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
