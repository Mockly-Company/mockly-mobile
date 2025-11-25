import { API_BASE_URL } from '@env';
import { useAuthStore } from '@features/auth/store';
import { initializeApiClient as initializeAxiosApiClient } from '@mockly/api';
import {
  AppError,
  ErrorCode,
  ErrorCoverage,
  getDefaultErrorMessage,
  mapStatusCodeToErrorCode,
} from '@shared/errors';

export const initializeApiClient = () =>
  initializeAxiosApiClient({
    baseURL: API_BASE_URL || 'http://localhost:8080',
    timeout: 30000,
    requestInterceptor: async config => {
      const accessToken = useAuthStore.getState().authState?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    responseErrorInterceptor: async error => {
      // HTTP 응답이 있는 경우 (4xx, 5xx 에러)
      if (error.response) {
        const statusCode = error.response.status;
        const errorCode = mapStatusCodeToErrorCode(statusCode);
        const defaultMessage = getDefaultErrorMessage(errorCode);

        // 서버에서 제공한 에러 메시지 사용 (있는 경우)
        const responseData = error.response.data as Record<string, unknown>;
        const serverMessage =
          (typeof responseData?.message === 'string'
            ? responseData.message
            : null) ||
          (typeof responseData?.error === 'string' ? responseData.error : null);
        return Promise.reject(
          new AppError(
            error,
            ErrorCoverage.LOGGING,
            serverMessage || defaultMessage,
            errorCode,
            statusCode,
          ),
        );
      }

      // 요청 타임아웃
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return Promise.reject(
          new AppError(
            error,
            ErrorCoverage.LOGGING,
            getDefaultErrorMessage(ErrorCode.TIMEOUT),
            ErrorCode.TIMEOUT,
          ),
        );
      }

      // 네트워크 연결 없음
      if (error.message === 'Network Error' || !error.response) {
        return Promise.reject(
          new AppError(
            error,
            ErrorCoverage.LOGGING,
            getDefaultErrorMessage(ErrorCode.NETWORK_ERROR),
            ErrorCode.NETWORK_ERROR,
          ),
        );
      }
      // 알 수 없는 에러
      return Promise.reject(
        new AppError(
          error,
          ErrorCoverage.LOGGING,
          getDefaultErrorMessage(ErrorCode.UNKNOWN),
          ErrorCode.UNKNOWN,
        ),
      );
    },
  });
