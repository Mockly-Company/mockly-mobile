import { initializeApiClient } from '@configs/apiClient/initializeApiClient';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';

import { useNetworkMonitor } from '@hooks/useNetworkMonitor';
import { Toast } from '@app/components/Toast/Toast';
import { useDeviceColorScheme } from '@hooks/useDeviceColorScheme';

import { hideNativeSplashScreen } from '@libs/NativeSplashScreen';
import { PropsWithChildren, useEffect, useState } from 'react';
import { RootNavigator } from '@app/navigation/RootNavigator';
import { deviceInfo } from '@libs/deviceInfo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@configs/queryClient/QueryClientProvider';
import { LoggedInStackParamList } from '@app/navigation/types';

import { useErrorBoundary } from 'react-error-boundary';
import { useInitializeAuthAndGetProfile } from '@features/auth/hooks';
import { GlobalErrorBoundary } from '@errors/boundaries';

export const navigationRef =
  createNavigationContainerRef<LoggedInStackParamList>();

function App() {
  useNetworkMonitor();

  return (
    <GlobalProviders>
      <ContentWithContext />
    </GlobalProviders>
  );
}

export default App;
const ContentWithContext = () => {
  const { isDarkMode, naviTheme } = useDeviceColorScheme();

  const isReady = useInitialize();
  if (!isReady) return;

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={hideNativeSplashScreen}
      theme={naviTheme}
      linking={{ enabled: true, prefixes: ['mockly://'] }}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigator />
      <Toast />
    </NavigationContainer>
  );
};

const useInitialize = () => {
  const [isReady, setIsReady] = useState(false);
  const initializeAuthAndGetProfile = useInitializeAuthAndGetProfile();
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const initialize = async () => {
      const deviceId = await deviceInfo.initializeDevice();
      await initializeApiClient(deviceId);
      await initializeAuthAndGetProfile();
    };
    initialize()
      .catch(err => showBoundary(err))
      .finally(() => {
        setIsReady(true);
        hideNativeSplashScreen();
      });
  }, [showBoundary, initializeAuthAndGetProfile]);

  return isReady;
};

const GlobalProviders = ({ children }: PropsWithChildren) => {
  return (
    <GlobalErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <QueryClientProvider>{children}</QueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </GlobalErrorBoundary>
  );
};
