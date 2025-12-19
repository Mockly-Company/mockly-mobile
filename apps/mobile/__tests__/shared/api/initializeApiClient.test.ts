jest.mock('@features/auth/store');
jest.mock('@libs/deviceInfo', () => ({
  deviceInfo: {
    initializeDevice: jest.fn().mockResolvedValue('mock-device-id'),
  },
}));

import { useAuthStore } from '@features/auth/store';
import { localStorage } from '@features/auth/localStorage';
import { initializeApiClient } from '@configs/apiClient/initializeApiClient';
import { toast } from '@libs/toast';
import type { AxiosRequestConfig, AxiosError } from '@mockly/api';

// Use global mock provided in jest.setup.js
const { __getCapturedApiConfig } = require('@mockly/api');

const mockAppStateEventListeners: Array<(state: string) => void> = [];
jest.mock('react-native', () => ({
  AppState: {
    addEventListener: jest.fn(
      (event: string, callback: (state: string) => void) => {
        mockAppStateEventListeners.push(callback);
        return { remove: jest.fn() };
      },
    ),
  },
}));

describe('initializeApiClient', () => {
  let capturedRequestInterceptor:
    | ((config: AxiosRequestConfig) => Promise<AxiosRequestConfig>)
    | null = null;
  let capturedResponseErrorInterceptor:
    | ((error: AxiosError) => Promise<never>)
    | null = null;

  const mockAuthState = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAppStateEventListeners.length = 0;
    capturedRequestInterceptor = null;
    capturedResponseErrorInterceptor = null;

    // Spy on localStorage methods
    jest
      .spyOn(localStorage, 'getAccessToken')
      .mockReturnValue(mockAuthState.accessToken);

    // Capture interceptors from global mock
    initializeApiClient('test-device-id');
    const capturedConfig = __getCapturedApiConfig();
    capturedRequestInterceptor = capturedConfig.requestInterceptor;
    capturedResponseErrorInterceptor = capturedConfig.responseErrorInterceptor;

    (useAuthStore.getState as jest.Mock).mockReturnValue({
      refreshToken: jest.fn().mockResolvedValue(true),
      signOut: jest.fn(),
    });
  });

  describe('초기화', () => {
    it('initializeAxiosApiClient를 올바른 설정으로 호출해야 함', () => {
      const cfg = __getCapturedApiConfig();
      expect(cfg).toEqual(
        expect.objectContaining({
          baseURL: expect.any(String),
          timeout: 15000,
          requestInterceptor: expect.any(Function),
          responseErrorInterceptor: expect.any(Function),
        }),
      );
    });
  });

  describe('Request Interceptor', () => {
    it('accessToken이 있으면 Authorization 헤더를 추가해야 함', async () => {
      const config: AxiosRequestConfig = { headers: {} };
      const result = await capturedRequestInterceptor!(config);

      expect(result.headers?.Authorization).toBe(
        `Bearer ${mockAuthState.accessToken}`,
      );
    });
  });

  describe('Response Error Interceptor', () => {
    beforeEach(() => {
      // Spy on toast methods for verification
      jest.spyOn(toast, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    const createAxiosError = (status: number, message: string): AxiosError =>
      ({
        config: { headers: {} },
        isAxiosError: true,
        toJSON: () => ({}),
        name: 'AxiosError',
        message,
        response: {
          data: {},
          status,
          statusText: 'Error',
          headers: {},
          config: { headers: {} },
        },
      }) as AxiosError;

    // TODO: Network/400 toast behavior tests skipped due to mocking complexity

    it('403 에러는 Toast 없이 throw 되어야 함', async () => {
      const error = createAxiosError(403, 'Forbidden');
      await expect(capturedResponseErrorInterceptor!(error)).rejects.toThrow();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('404 에러는 Component 범위 AppError로 throw (Toast 없음)', async () => {
      const error = createAxiosError(404, 'Not Found');
      await expect(capturedResponseErrorInterceptor!(error)).rejects.toThrow();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('500 에러는 Toast 없이 throw 되어야 함', async () => {
      const error = createAxiosError(500, 'Internal Server Error');
      await expect(capturedResponseErrorInterceptor!(error)).rejects.toThrow();
      expect(toast.error).not.toHaveBeenCalled();
    });
  });
});
