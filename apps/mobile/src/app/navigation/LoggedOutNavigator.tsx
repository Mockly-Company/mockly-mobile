import { OnboardingScreen } from '@app/screens/onboarding/OnboardingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { LoggedOutStackParamList } from './types';

const Stack = createStackNavigator<LoggedOutStackParamList>();
export const LoggedOutNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Group>
        <Stack.Screen name="Landing" component={OnboardingScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
