import { createStackNavigator } from '@react-navigation/stack';
import { PaymentParamList } from '../types';

import {
  PaymentHistoryScreen,
  SubscriptionPaymentScreen,
  SinglePaymentScreen,
  PaymentSuccessScreen,
} from '@app/screens/payment';
import { PaymentFailScreen } from '@app/screens/payment/PaymentFailScreen';
import { PaymentInvoiceScreen } from '@app/screens/payment/PaymentInvoiceScreen';

const Stack = createStackNavigator<PaymentParamList>();

export const PaymentNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{
          title: '결제 내역',
        }}
      />
      <Stack.Screen
        name="SubscriptionPayment"
        component={SubscriptionPaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SinglePayment"
        component={SinglePaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentFail"
        component={PaymentFailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentInvoice"
        component={PaymentInvoiceScreen}
        options={{
          title: '청구서',
        }}
      />
    </Stack.Navigator>
  );
};
