jest.mock('@features/auth/store');
jest.mock('@shared/utils/deviceInfo', () => ({
  deviceInfo: {
    initializeDevice: jest.fn().mockResolvedValue('mock-device-id'),
  },
}));

import { useAuthStore } from '@features/auth/store';
import { localStorage } from '@features/auth/localStorage';
import { initializeApiClient } from '@shared/api/initializeApiClient';
import { toast } from '@shared/utils/toast';
import { AppState } from 'react-native';
import type { AxiosRequestConfig, AxiosError } from '@mockly/api';
import { deviceInfo } from '@shared/utils/deviceInfo';

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

    it('AppState 변경 이벤트 리스너를 등록해야 함', () => {
      expect(AppState.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      );
    });

    it('기존 구독이 있으면 정리해야 함', async () => {
      const mockRemove = jest.fn();
      const deviceId = await deviceInfo.initializeDevice();
      // 첫 초기화 반환값: remove 포함
      (AppState.addEventListener as jest.Mock).mockReturnValueOnce({
        remove: mockRemove,
      });
      initializeApiClient(deviceId);
      // 두번째 초기화시 이전 구독 remove 호출 기대
      (AppState.addEventListener as jest.Mock).mockReturnValueOnce({
        remove: jest.fn(),
      });
      initializeApiClient(deviceId);
      expect(mockRemove).toHaveBeenCalledTimes(1);
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

    it('accessToken이 없으면 Authorization 헤더를 추가하지 않아야 함', async () => {
      jest.spyOn(localStorage, 'getAccessToken').mockReturnValue(null);

      const config: AxiosRequestConfig = { headers: {} };
      const result = await capturedRequestInterceptor!(config);

      expect(result.headers?.Authorization).toBeUndefined();
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

    it('401 에러는 토큰 갱신을 시도해야 함', async () => {
      // localStorage의 getRefreshToken을 mock (실제 코드에서는 이것을 호출)
      jest
        .spyOn(localStorage, 'getRefreshToken')
        .mockResolvedValue('mock-refresh-token');
      jest
        .spyOn(localStorage, 'getAccessToken')
        .mockReturnValue('new-access-token');

      const error = createAxiosError(401, 'Unauthorized');
      (error.config as unknown as { _retry: boolean })._retry = false;

      // 401 에러가 토큰 갱신 로직을 trigger하는지 확인
      // 실제로는 localStorage.getRefreshToken()이 호출되고, 새 토큰으로 재시도
      await expect(capturedResponseErrorInterceptor!(error)).rejects.toThrow();

      // localStorage의 getRefreshToken이 호출되었는지 확인
      expect(localStorage.getRefreshToken).toHaveBeenCalled();
    });
  });
});
