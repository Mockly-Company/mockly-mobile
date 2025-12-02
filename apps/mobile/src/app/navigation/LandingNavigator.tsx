import { OnboardingScreen } from '@app/screens/onboarding/OnboardingScreen';
import { createStackNavigator } from '@react-navigation/stack';

export type LandingStackParamList = {
  Onboarding: undefined;
  Landing: undefined;
};
const Stack = createStackNavigator<LandingStackParamList>();
export const LandingNavigator = () => {
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
