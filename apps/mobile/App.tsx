import { initializeApiClient } from '@shared/api/initializeApiClient';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { GlobalErrorBoundary } from './src/shared/errors';
import { useNetworkMonitor } from './src/shared/hooks/useNetworkMonitor';
import { Toast } from './src/app/components/Toast/Toast';
import { useDeviceColorScheme } from '@shared/hooks/useDeviceColorScheme';

import { hideNativeSplashScreen } from '@shared/utils/NativeSplashScreen';
import { PropsWithChildren, useEffect, useState } from 'react';
import { RootNavigator } from '@app/navigation/RootNavigator';
import { deviceInfo } from '@shared/utils/deviceInfo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@shared/api/QueryClientProvider';
import { LoggedInStackParamList } from '@app/navigation/types';

import { useErrorBoundary } from 'react-error-boundary';
import { useInitializeAuthAndGetProfile } from '@features/auth/hooks';

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
