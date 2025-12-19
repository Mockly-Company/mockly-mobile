import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator/TabNavigator';
import { LoggedInStackParamList } from './types';
import { PaymentNavigator } from './PaymentNavigator/PaymentNavigator';
import { ScreenErrorBoundary } from '@errors/boundaries';

import { ProductBottomSheetProvider } from '@app/screens/product/ProductBottomSheetProvider';
import { SubscriptionNavigator } from './SubscriptionNavigator/SubscriptionNavigator';

const Stack = createStackNavigator<LoggedInStackParamList>();

export const LoggedInNavigator = () => {
  return (
    <Stack.Navigator
      screenLayout={({ children }) => (
        <ScreenErrorBoundary>
          <ProductBottomSheetProvider>{children}</ProductBottomSheetProvider>
        </ScreenErrorBoundary>
      )}
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
    </Stack.Navigator>
  );
};
