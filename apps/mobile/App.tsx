import { useEffect } from 'react';
import { tw } from '@mockly/design-system';
import { useAppColorScheme, useDeviceContext } from 'twrnc';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './src/app/navigation/BottomTabNavigator';
import { initializeApiClient } from '@mockly/api';
import { useAuthStore } from './src/features/auth/store';
import { API_BASE_URL } from '@env';
import Toast, {
  BaseToast,
  type BaseToastProps,
} from 'react-native-toast-message';

initializeApiClient({
  baseURL: API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  getAuthToken: () => {
    return useAuthStore.getState().authState?.accessToken || null;
  },
});

const toastConfig = {
  success: (props: BaseToastProps) => (
    <View
      accessible={true}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <BaseToast {...props} />
    </View>
  ),
  error: (props: BaseToastProps) => (
    <View
      accessible={true}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <BaseToast {...props} />
    </View>
  ),
  info: (props: BaseToastProps) => (
    <View
      accessible={true}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <BaseToast {...props} />
    </View>
  ),
};

function App() {
  useDeviceContext(tw);
  const [colorScheme] = useAppColorScheme(tw);
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <BottomTabNavigator />
        <Toast config={toastConfig} topOffset={60} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
