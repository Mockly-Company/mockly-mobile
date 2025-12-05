import { initializeApiClient } from '@shared/api/initializeApiClient';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/app/navigation/utils/navigate';
import { GlobalErrorBoundary } from './src/shared/errors';
import { useNetworkMonitor } from './src/shared/hooks/useNetworkMonitor';
import { Toast } from './src/app/components/Toast/Toast';
import { useDeviceColorScheme } from '@shared/hooks/useDeviceColorScheme';
import { useInitializeAuth } from '@features/auth/hooks';
import { hideNativeSplashScreen } from '@shared/utils/NativeSplashScreen';
import { useEffect, useState } from 'react';
import { RootNavigator } from '@app/navigation/RootNavigator';
import { deviceInfo } from '@shared/utils/deviceInfo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
function App() {
  const [isReady, setIsReady] = useState(false);
  // 다크 모드 감지, tw theme 설정 반영
  const { isDarkMode, naviTheme } = useDeviceColorScheme();

  const initializeAuth = useInitializeAuth();

  useNetworkMonitor();

  useEffect(() => {
    const initialize = async () => {
      // Device ID 초기화 (없으면 keychain에 생성!)
      const deviceId = await deviceInfo.initializeDevice();
      await initializeApiClient(deviceId);
      await initializeAuth();
      setIsReady(true);
    };
    initialize();
  }, [initializeAuth]);

  if (!isReady) {
    return null;
  }
  return (
    <GlobalErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              hideNativeSplashScreen();
            }}
            theme={naviTheme}
            linking={{ enabled: true, prefixes: ['mockly://'] }}
          >
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <RootNavigator />
            <Toast />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
