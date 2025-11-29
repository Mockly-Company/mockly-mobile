import { NativeModules } from 'react-native';

interface SplashScreenModule {
  hide(): void;
  show(): void;
}

const { SplashScreen } = NativeModules as {
  SplashScreen?: SplashScreenModule;
};

/**
 * 네이티브 스플래시 화면을 숨깁니다.
 * React Navigation이 준비되면 호출됩니다.
 */
export const hideNativeSplashScreen = () => {
  if (SplashScreen) {
    SplashScreen.hide();
  }
};

/**
 * 네이티브 스플래시 화면을 표시합니다.
 * (선택적 - 필요한 경우에만 사용)
 */
export const showNativeSplashScreen = () => {
  if (SplashScreen) {
    SplashScreen.show();
  }
};
