import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator/TabNavigator';
import { LoggedInStackParamList } from './types';
import { PaymentNavigator } from './PaymentNavigator/PaymentNavigator';
import { ScreenErrorBoundary } from '@errors/boundaries';

import { ProductBottomSheetProvider } from '@app/screens/product/ProductBottomSheetProvider';
import { SubscriptionNavigator } from './SubscriptionNavigator/SubscriptionNavigator';

import { OTPVerificationScreen } from '@app/screens/auth/OTPVerificationScreen';
import { OTPRequestScreen } from '@app/screens/auth/OTPRequestScreen';
import { Icon, tw } from '@mockly/design-system';

const Stack = createStackNavigator<LoggedInStackParamList>();

export const LoggedInNavigator = () => {
  return (
    <Stack.Navigator
      screenLayout={({ children }) => (
        <ScreenErrorBoundary>
          <ProductBottomSheetProvider>{children}</ProductBottomSheetProvider>
        </ScreenErrorBoundary>
      )}
      screenOptions={{
        headerBackImage: () => (
          <Icon name="chevron-left" style={tw`text-text dark:text-text-dark`} />
        ),
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payments"
        component={PaymentNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTPRequest"
        component={OTPRequestScreen}
        options={{
          headerShown: true,
          title: '휴대전화 인증',
        }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={{
          headerShown: true,
          title: 'OTP 인증',
        }}
      />
    </Stack.Navigator>
  );
};
