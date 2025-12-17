import { API_BASE_URL } from '@env';
import {
  initializeApiClient as initializeAxiosApiClient,
  apiClient,
  AxiosRequestConfig,
} from '@mockly/api';
import { useAuthStore } from '@features/auth/store';
import { AppError, ErrorCoverage } from '@shared/errors';
import { toast } from '@shared/utils/toast';
import { localStorage } from '@features/auth/localStorage';
// 15초: 모바일 네트워크 환경 고려한 타임아웃
const API_TIMEOUT = 15000;

// 재시도 플래그 및 카운터가 추가된 요청 config 타입
interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

// 토큰 갱신 중 여부를 추적

const apiPendingQueue = apiTaskQueue();

export const initializeApiClient = async (deviceId: string) => {
  initializeAxiosApiClient({
    baseURL: API_BASE_URL || 'http://localhost:8080',
    timeout: API_TIMEOUT,
    headers: {
      'X-Device-Id': deviceId,
    },
    requestInterceptor: async config => {
      // Access Token 추가
      const accessToken = localStorage.getAccessToken();

      if (accessToken) {
        config.headers.Authorization ??= `Bearer ${accessToken}`;
        // config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    responseErrorInterceptor: async error => {
      const originalRequest = error.config as RetryableRequestConfig;
      const apiError = AppError.fromAxiosError(
        error,
        ErrorCoverage.NONE,
        error.response?.data?.message || undefined,
      );
      // 1. Network/Timeout 에러 → Toast로 처리 (Error Boundary에 도달하지 않음)
      if (apiError.isConnectionError) {
        toast.error(apiError.displayMessage || apiError.message);
        throw apiError;
      }

      // 2. 일반 클라이언트 에러 (400, 422) → Toast로 처리
      if (apiError.isCommonError) {
        toast.error(apiError.displayMessage || apiError.message);
        throw apiError;
      }

      // 3. 권한 없음 (403) → Toast로 처리
      if (apiError.hasNoPermission) {
        throw apiError;
      }

      // 4. 404 Not Found → Error Boundary에서 Fallback UI 결정
      if (apiError.hasNoResource) {
        throw AppError.fromAxiosError(
          error,
          ErrorCoverage.COMPONENT,
          apiError.displayMessage || apiError.message,
        );
      }
      // 5. 500번대 서버 에러 → Toast로 처리
      if (apiError.isServerError) {
        throw apiError;
      }

      // 6. 401 에러 처리 (토큰 갱신 로직)
      if (!apiError.shouldRefreshToken || originalRequest._retry) {
        throw apiError;
      }
      if (apiError.shouldReLogin) {
        // 토큰 갱신이 필요하지 않은 경우
        await useAuthStore.getState().signOut();
        return;
      }

      // 이미 토큰을 갱신중인 경우.
      if (apiPendingQueue.isRefreshing()) {
        const isRefreshAPI = error.response?.config.url === '/api/auth/refresh';
        if (isRefreshAPI) {
          apiPendingQueue.cleareRefresh();
          await useAuthStore.getState().signOut();
          throw new AppError(
            error,
            ErrorCoverage.GLOBAL,
            '세션 갱신에 실패했습니다. 재로그인 해주세요.',
          );
        }
        return new Promise((resolve, reject) => {
          apiPendingQueue.subscribeTokenRefresh({
            resolve,
            reject,
            originalRequest,
          });
        });
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;
      apiPendingQueue.setIsRefreshing(true);

      try {
        // 7초 타임아웃 설정
        const refreshToken = useAuthStore.getState().refreshToken();
        await apiPendingQueue.throwErrorWhenTimeOutOrReturnResult(refreshToken);
        const newAccessToken = useAuthStore.getState().getAccessToken();
        if (!newAccessToken) throw new Error('리프레시 에러');

        apiPendingQueue.exceuteApiWithNewToken(newAccessToken);
        apiPendingQueue.setIsRefreshing(false);

        return apiClient.client(originalRequest);
      } catch (e) {
        await useAuthStore.getState().signOut();
        apiPendingQueue.cleareRefresh();
        apiPendingQueue.setIsRefreshing(false);
        throw new AppError(e, ErrorCoverage.GLOBAL, '토큰 리프레시 에러');
      }
    },
  });
};

type ApiTaskObject = {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
  originalRequest: RetryableRequestConfig;
};

function apiTaskQueue() {
  const TOKEN_REFRESH_TIMEOUT = 7000;
  let isRefreshing = false;
  let refreshSubscribers: ApiTaskObject[] = [];

  return {
    isRefreshing: () => isRefreshing,
    setIsRefreshing: (value: boolean) => {
      isRefreshing = value;
    },
    subscribeTokenRefresh: (task: ApiTaskObject) => {
      refreshSubscribers.push(task);
    },
    exceuteApiWithNewToken: (token: string) => {
      refreshSubscribers.forEach(task => {
        const { resolve, originalRequest } = task;
        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(apiClient.client(originalRequest));
      });
      refreshSubscribers = [];
    },
    cancelAllApi: () => {
      refreshSubscribers.forEach(task => {
        const { reject } = task;
        reject(null);
      });
      refreshSubscribers = [];
    },
    cleareRefresh: () => {
      refreshSubscribers = [];
    },
    throwErrorWhenTimeOutOrReturnResult: <T>(
      promise: Promise<T>,
    ): Promise<T> => {
      const timeoutPromise = new Promise<T>((_, reject) => {
        setTimeout(() => {
          reject(
            new AppError(
              '토큰 갱신 타임아웃',
              ErrorCoverage.GLOBAL,
              '토큰 갱신 실패',
            ),
          );
        }, TOKEN_REFRESH_TIMEOUT);
      });
      return Promise.race([promise, timeoutPromise]);
    },
  };
}
