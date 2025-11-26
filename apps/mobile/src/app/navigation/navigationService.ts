import { createNavigationContainerRef } from '@react-navigation/native';
import type { BottomTabParamList } from './BottomTabNavigator';

/**
 * 앱 전역에서 사용 가능한 Navigation Reference
 * 컴포넌트 외부(Zustand store 등)에서 네비게이션 제어 가능
 */
export const navigationRef = createNavigationContainerRef<BottomTabParamList>();

/**
 * 홈 화면으로 이동
 */
export function navigateToHome() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Home');
  }
}

/**
 * 특정 화면으로 이동
 */
export function navigate<RouteName extends keyof BottomTabParamList>(
  name: RouteName,
  params?: BottomTabParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    // @ts-expect-error - React Navigation 타입 호환성 문제
    navigationRef.navigate(name, params);
  }
}
