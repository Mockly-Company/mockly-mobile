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

// React Native Restart mock
jest.mock('react-native-restart', () => ({
  __esModule: true,
  default: {
    restart: jest.fn(),
  },
}));

// twrnc mock
jest.mock('twrnc', () => ({
  create: jest.fn(() => {
    const tw = jest.fn((...args) => args.flat());
    tw.style = jest.fn((...args) => args.flat());
    tw.color = jest.fn(color => color);
    return tw;
  }),
  useDeviceContext: jest.fn(),
  useAppColorScheme: jest.fn(() => ['light', jest.fn()]),
}));

// @mockly/design-system mock
const mockTw = jest.fn((...args) => args.flat());
mockTw.style = jest.fn((...args) => args.flat());
mockTw.color = jest.fn(color => color);

jest.mock('@mockly/design-system', () => {
  const theme = {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      accent: '#FF9500',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#8E8E93',
      border: '#C6C6C8',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    typography: {
      fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 32 },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
    borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  };
  return { tw: mockTw, theme, default: theme };
});

// React Native Toast Message mock
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
    hide: jest.fn(),
  },
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

// NetInfo Mock
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));

// Logger Mock
jest.mock('./src/shared/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    logException: jest.fn(),
    warn: jest.fn(),
  },
}));

// Toast Mock 제거 - 실제 구현 사용, react-native-toast-message만 mock
// (각 테스트에서 필요시 개별적으로 toast.error 등을 spy)

// @mockly/api Global Mock (factory-local state to satisfy Jest scoping)
jest.mock('@mockly/api', () => {
  let mockCapturedApiConfig = null;
  const initializeApiClient = jest.fn(config => {
    mockCapturedApiConfig = config;
  });
  class AxiosError extends Error {
    constructor(message) {
      super(message);
      this.isAxiosError = true;
      this.name = 'AxiosError';
      this.config = { headers: {} };
      this.response = undefined;
    }
    toJSON() {
      return {};
    }
  }
  return {
    initializeApiClient,
    apiClient: {
      client: {
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      },
    },
    AxiosError,
    __getCapturedApiConfig: () => mockCapturedApiConfig,
  };
});

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
