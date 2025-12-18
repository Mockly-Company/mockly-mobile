import { createStackNavigator } from '@react-navigation/stack';
import { SubscriptionParamList } from '../types';

import {
  SubscriptionChangeScreen,
  SubscriptionCancelScreen,
  SubscribeScreen,
} from '@app/screens/subscription';

const Stack = createStackNavigator<SubscriptionParamList>();

export const SubscriptionNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Subscribe"
        component={SubscribeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SubscriptionChange"
        component={SubscriptionChangeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SubscriptionCancel"
        component={SubscriptionCancelScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
