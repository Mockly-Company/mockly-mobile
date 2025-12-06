import { createNavigationContainerRef } from '@react-navigation/native';
import type { BottomTabParamList } from '../BottomTabNavigator';
import { LandingStackParamList } from '../LandingNavigator';

/**
 * 앱 전역에서 사용 가능한 Navigation Reference
 * 컴포넌트 외부(Zustand store 등)에서 네비게이션 제어 가능
 */
export const navigationRef =
  createNavigationContainerRef<LandingStackParamList>();

/**
 * 홈 화면으로 이동
 */
export function navigateToLanding() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Landing');
  }
}

/**
 * 특정 화면으로 이동
 */
export function navigate<
  RouteName extends keyof BottomTabParamList,
  LandingRouteName extends keyof LandingStackParamList,
>(
  name: RouteName | LandingRouteName,
  params?:
    | BottomTabParamList[RouteName]
    | LandingStackParamList[LandingRouteName],
) {
  if (navigationRef.isReady()) {
    // @ts-expect-error - React Navigation 타입 호환성 문제
    navigationRef.navigate(name, params);
  }
}
