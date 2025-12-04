// Must be set before any imports that require __DEV__
global.__DEV__ = true;

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  return RN;
});
jest.mock('react-native-nitro-modules', () => {
  return {
    NitroModules: () => {
      return {};
    },
  };
});
const mockRNDeviceInfo = require('react-native-device-info/jest/react-native-device-info-mock.js');
jest.mock('react-native-device-info', () => mockRNDeviceInfo);

// Custom native modules
const mockRNCNetInfo = require('@react-native-community/netinfo/jest/netinfo-mock.js');
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

// 토스트 메시지 관련 mock 설정
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// React Native App Auth mock
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

// Logger Mock
jest.mock('./src/shared/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    logException: jest.fn(),
    warn: jest.fn(),
  },
}));

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
