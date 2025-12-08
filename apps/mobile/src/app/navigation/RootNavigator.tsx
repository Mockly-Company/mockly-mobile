import { BottomTabNavigator } from './BottomTabNavigator';

// import { useAuth } from '@features/auth/hooks';
import { LandingNavigator } from './LandingNavigator';

export const RootNavigator = () => {
  // const { isAuthenticated } = useAuth();
  // 인증 상태에 따른 화면 분기
  return true ? <BottomTabNavigator /> : <LandingNavigator />;
};
