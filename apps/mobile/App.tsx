import { useEffect } from 'react';
import { tw } from '@mockly/design-system';
import { useAppColorScheme, useDeviceContext } from 'twrnc';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './src/app/navigation/BottomTabNavigator';

import { useAuthStore } from './src/features/auth/store';

import { GlobalErrorBoundary } from './src/shared/errors';
import Toast from 'react-native-toast-message';
import { initializeApiClient } from '@shared/api/initializeApiClient';

// API 에러는 Error Boundary에서 처리되므로 console.error 경고 무시
LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);
initializeApiClient();

function App() {
  useDeviceContext(tw);
  const [colorScheme] = useAppColorScheme(tw);
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const isDarkMode = colorScheme === 'dark';

  return (
    <GlobalErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <BottomTabNavigator />
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
