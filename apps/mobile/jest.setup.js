/* eslint-env jest */
global.__DEV__ = true;

// Mock Platform before any imports
jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const Platform = {
    OS: 'android',
    select: jest.fn(obj => obj.android || obj.default),
    Version: 30,
    isTV: false,
    isTesting: true,
    constants: {
      reactNativeVersion: {
        major: 0,
        minor: 82,
        patch: 1,
      },
    },
  };
  return Platform;
});

// React Native mock
jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
  refresh: jest.fn(),
  revoke: jest.fn(),
}));

// ActivityIndicator mock
jest.mock(
  'react-native/Libraries/Components/ActivityIndicator/ActivityIndicator',
  () => {
    const { View } = require('react-native');
    return {
      __esModule: true,
      default: ({ testID, ...props }) => <View testID={testID} {...props} />,
    };
  },
);

jest.mock('react-native-gesture-handler/jestSetup');
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// AsyncStorage Mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  // 테스트 환경에서 예상되는 에러 로그는 모두 무시
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('deprecated') ||
      args[0].includes('Warning:') ||
      args[0].includes('act(...)') ||
      args[0].includes('Token exchange failed') ||
      args[0].includes('Token refresh failed') ||
      args[0].includes('Token revoke failed') ||
      args[0].includes('ID Token decode failed') ||
      args[0].includes('로그인 실패') ||
      args[0].includes('로그아웃 실패') ||
      args[0].includes('PKCE Authorization Error'))
  ) {
    return;
  }

  // 그 외 실제 에러만 출력
  originalError(...args);
};

console.warn = (...args) => {
  // React Native 경고 필터링
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('componentWill') ||
      args[0].includes('Warning:') ||
      args[0].includes('deprecated'))
  ) {
    return;
  }
  originalWarn(...args);
};
