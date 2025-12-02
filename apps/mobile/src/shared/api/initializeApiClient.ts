import { API_BASE_URL } from '@env';
import {
  initializeApiClient as initializeAxiosApiClient,
  apiClient,
  AxiosRequestConfig,
  AxiosError,
} from '@mockly/api';
import { useAuthStore } from '@features/auth/store';
import { AppError, ErrorCoverage } from '@shared/errors';
import { AppState } from 'react-native';
import { toast } from '@shared/utils/toast';
import { logger } from '@shared/utils/logger';

// 15초: 모바일 네트워크 환경 고려한 타임아웃
const API_TIMEOUT = 15000;
// 토큰 갱신 타임아웃 (10초)
const TOKEN_REFRESH_TIMEOUT = 10000;
// 최대 토큰 갱신 재시도 횟수
const MAX_RETRY_COUNT = 3;

// 재시도 플래그 및 카운터가 추가된 요청 config 타입
interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

// 토큰 갱신 중 여부를 추적
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// 대기 중인 요청 처리
const processQueue = (error: AppError | null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      // resolve(null) 후 .then()에서 apiClient.client()로 실제 요청 재시도
      promise.resolve(null);
    }
  });
  failedQueue = [];
};

// 모듈 최상단에서 구독 관리
let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null =
  null;

export const initializeApiClient = () => {
  // 기존 구독 정리
  if (appStateSubscription) {
    appStateSubscription.remove();
  }

  // AppState 변경 시 대기열 정리 (메모리 누수 방지)
  appStateSubscription = AppState.addEventListener('change', nextAppState => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      if (failedQueue.length > 0) {
        processQueue(
          AppError.fromNetworkError(
            '앱이 백그라운드로 전환되었습니다',
            ErrorCoverage.NONE,
          ),
        );
        isRefreshing = false;
      }
    }
  });

  initializeAxiosApiClient({
    baseURL: API_BASE_URL || 'http://localhost:8080',
    timeout: API_TIMEOUT,
    requestInterceptor: async config => {
      const accessToken = useAuthStore.getState().authState?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
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
        logger.logException(apiError, {
          handler: 'interceptor',
          handledBy: 'toast',
          type: 'connection',
        });
        toast.error(apiError.displayMessage || apiError.message);
        throw apiError;
      }

      // 2. 일반 클라이언트 에러 (400, 422) → Toast로 처리
      if (apiError.isCommonError) {
        logger.logException(apiError, {
          handler: 'interceptor',
          handledBy: 'toast',
          type: 'client-error',
          statusCode: apiError.statusCode,
        });
        toast.error(apiError.displayMessage || apiError.message);
        throw apiError;
      }

      // 3. 권한 없음 (403) → Toast로 처리
      if (apiError.hasNoPermission) {
        logger.logException(apiError, {
          handler: 'interceptor',
          handledBy: 'toast',
          type: 'permission-denied',
          statusCode: apiError.statusCode,
        });
        throw apiError;
      }

      // 4. 404 Not Found → Error Boundary에서 Fallback UI 결정
      if (apiError.hasNoResource) {
        logger.logException(apiError, {
          handler: 'interceptor',
          handledBy: 'error-boundary',
          type: 'not-found',
          statusCode: apiError.statusCode,
        });
        throw AppError.fromAxiosError(
          error,
          ErrorCoverage.COMPONENT,
          apiError.displayMessage || apiError.message,
        );
      }

      // 5. 500번대 서버 에러 → Toast로 처리
      if (apiError.isServerError) {
        logger.logException(apiError, {
          handler: 'interceptor',
          handledBy: 'toast',
          type: 'server-error',
          statusCode: apiError.statusCode,
        });
        throw apiError;
      }

      // 6. 401 에러 처리 (토큰 갱신 로직)
      if (error.response?.status !== 401 || originalRequest?._retry) {
        throw apiError;
      }

      // 토큰 갱신이 필요하지 않은 경우
      if (!apiError.shouldRefreshToken) {
        // 재로그인이 필요한 경우 로그아웃 처리
        if (apiError.shouldReLogin) {
          await useAuthStore.getState().signOut();
        }
        throw apiError;
      }

      // 토큰 갱신이 필요한 경우
      if (isRefreshing) {
        // 요청별 재시도 횟수 확인
        const currentRetryCount = (originalRequest._retryCount || 0) + 1;

        // 최대 재시도 횟수 초과 시
        if (currentRetryCount > MAX_RETRY_COUNT) {
          const maxRetryError = new AppError(
            new Error('최대 재시도 횟수를 초과했습니다'),
            ErrorCoverage.NONE,
            '최대 재시도 횟수를 초과했습니다',
          );

          processQueue(maxRetryError);
          await useAuthStore.getState().signOut();
          throw maxRetryError;
        }

        // 요청별 재시도 카운터 증가
        originalRequest._retryCount = currentRetryCount;

        // 이미 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // 갱신 완료 후 재시도
            const newToken = useAuthStore.getState().authState?.accessToken;
            if (originalRequest?.headers && newToken) {
              (
                originalRequest.headers as Record<string, string>
              ).Authorization = `Bearer ${newToken}`;
            }
            return apiClient.client(originalRequest!);
          })
          .catch(err => {
            throw err;
          });
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;
      originalRequest._retryCount = 0;
      isRefreshing = true;

      try {
        // 토큰 갱신 시도 (타임아웃 포함)
        const refreshPromise = useAuthStore.getState().refreshToken();
        const timeoutPromise = new Promise<boolean>((_, reject) =>
          setTimeout(
            () =>
              reject(
                AppError.fromTimeoutError(
                  '토큰 갱신 타임아웃',
                  ErrorCoverage.NONE,
                  '토큰 갱신 타임아웃',
                ),
              ),
            TOKEN_REFRESH_TIMEOUT,
          ),
        );

        const success = await Promise.race([refreshPromise, timeoutPromise]);

        if (!success) {
          // 갱신 실패
          const error = AppError.fromAxiosError(
            {
              ...originalRequest,
              message: '토큰 갱신에 실패했습니다',
              response: { status: 401 },
            } as AxiosError,
            ErrorCoverage.NONE,
            '토큰 갱신에 실패했습니다',
          );
          processQueue(error);
          throw apiError;
        }

        // 갱신 성공
        const newToken = useAuthStore.getState().authState?.accessToken;
        if (!newToken) {
          const error = AppError.fromAxiosError(
            {
              ...originalRequest,
              message: '새 토큰을 가져올 수 없습니다',
              response: { status: 401 },
            } as AxiosError,
            ErrorCoverage.NONE,
            '새 토큰을 가져올 수 없습니다',
          );
          processQueue(error);
          throw apiError;
        }

        // 대기 중인 요청들 처리
        processQueue(null);

        // 원래 요청에 새 토큰 적용하여 재시도
        if (originalRequest?.headers) {
          (originalRequest.headers as Record<string, string>).Authorization =
            `Bearer ${newToken}`;
        }

        return apiClient.client(originalRequest!);
      } catch (refreshError) {
        processQueue(refreshError as AppError);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    },
  });
};
