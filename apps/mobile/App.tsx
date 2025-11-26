import { initializeApiClient } from '@shared/api/initializeApiClient';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './src/app/navigation/BottomTabNavigator';
import { navigationRef } from './src/app/navigation/navigationService';
import { GlobalErrorBoundary } from './src/shared/errors';
import { useNetworkMonitor } from './src/shared/hooks/useNetworkMonitor';
import { ToastContainer } from './src/app/components/common/ToastContainer';
import { useDeviceColorScheme } from '@shared/hooks/useDeviceColorScheme';
import { useInitializeAuth } from '@features/auth/hooks';

initializeApiClient();

function App() {
  // 다크 모드 감지, tw theme 설정 반영
  const isDarkMode = useDeviceColorScheme();

  // Auth 인증 초기화
  useInitializeAuth();

  // 네트워크 상태 체크
  useNetworkMonitor();

  return (
    <GlobalErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <BottomTabNavigator />
          <ToastContainer />
        </NavigationContainer>
      </SafeAreaProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
