import React from 'react';
import {GlobalErrorBoundary} from '@mobile/shared/errors/boundaries/GlobalErrorBoundary';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {StatusBar, useWindowDimensions} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Toast} from '@mobile/app/components/Toast/Toast';
import {useAuthStore} from '@mobile/features/auth/store';
import {useEffect, useState} from 'react';

import {useMockDeviceColorScheme} from './useMockDeviceColorScheme';
import {LoggedInStackParamList} from '@mobile/app/navigation/types';
export const navigationRef =
  createNavigationContainerRef<LoggedInStackParamList>();
type MockProvidersProps = {
  children: React.ReactNode;
  /** Storybook용 초기 인증 상태 설정 */
  initialAuthState?: 'authenticated' | 'unauthenticated';
};

export const MockProviders = ({
  children,
  initialAuthState = 'unauthenticated',
}: MockProvidersProps) => {
  const [isReady, setIsReady] = useState(
    initialAuthState === 'unauthenticated',
  );
  const {width, height} = useWindowDimensions();
  // 다크 모드 감지, tw theme 설정 반영
  const {isDarkMode, naviTheme} = useMockDeviceColorScheme();
  const authStore = useAuthStore;
  // Storybook용 초기 상태 설정
  useEffect(() => {
    if (initialAuthState === 'authenticated') {
      // Mock 사용자 데이터로 로그인 상태 설정
      authStore.setState({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'storybook-user-123',
          email: 'storybook@mockly.com',
          name: 'Storybook User',
          provider: 'google',
        },
      });
      setIsReady(true);
    } else {
      // 로그아웃 상태
      authStore.setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  }, [initialAuthState, authStore]);

  if (!isReady) {
    return null;
  }
  return (
    <GlobalErrorBoundary>
      <SafeAreaProvider style={{width, height}}>
        <GestureHandlerRootView>
          <NavigationContainer
            ref={navigationRef}
            theme={naviTheme}
            linking={{enabled: true, prefixes: ['mockly://']}}>
            {children}

            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Toast />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </GlobalErrorBoundary>
  );
};
