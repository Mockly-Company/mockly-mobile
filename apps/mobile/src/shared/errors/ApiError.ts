import { ApiResponse, AxiosError } from '@mockly/api';

/**
 * API 에러 코드 상수
 */
export const ERROR_CODES = {
  // 400 Bad Request
  BAD_REQUEST: 'BAD_REQUEST',

  // 401 Unauthorized
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_REQUIRED: 'TOKEN_REQUIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVALID_GOOGLE_TOKEN: 'INVALID_GOOGLE_TOKEN',

  // 403 Forbidden
  FORBIDDEN: 'FORBIDDEN',

  // 404 Not Found
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',

  // 422 Unprocessable Entity
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // 네트워크 관련
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',

  // 알 수 없는 에러
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * 에러 응답 타입 가드
 */
interface ErrorResponse {
  code?: string;
  message?: string;
  error?: string;
}

const isErrorResponse = (data: unknown): data is ErrorResponse => {
  return typeof data === 'object' && data !== null;
};

/**
 * HTTP Status Code별 에러 메시지 매핑
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: '잘못된 요청. 요청 파라미터를 확인하세요',
  401: '인증이 필요합니다',
  403: '권한이 없습니다',
  404: '요청한 리소스를 찾을 수 없습니다',
  422: '폼 유효성 에러',
  500: '서버 에러가 발생했습니다',
};

/**
 * API 에러 기본 클래스
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: ErrorCode,
    public responseData?: ApiResponse<unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * 토큰 갱신이 필요한 경우
   */
  get shouldRefreshToken(): boolean {
    return (
      this.statusCode === 401 && this.errorCode === ERROR_CODES.EXPIRED_TOKEN
    );
  }

  /**
   * 재로그인이 필요한 경우
   */
  get shouldReLogin(): boolean {
    return (
      this.statusCode === 401 &&
      (this.errorCode === ERROR_CODES.UNAUTHORIZED ||
        this.errorCode === ERROR_CODES.TOKEN_REQUIRED ||
        this.errorCode === ERROR_CODES.INVALID_TOKEN ||
        this.errorCode === ERROR_CODES.INVALID_GOOGLE_TOKEN)
    );
  }

  /**
   * 네트워크 연결 에러인 경우 (타임아웃 또는 네트워크 에러)
   */
  get isConnectionError(): boolean {
    return (
      this.errorCode === ERROR_CODES.NETWORK_ERROR ||
      this.errorCode === ERROR_CODES.TIMEOUT_ERROR
    );
  }

  /**
   * 권한이 없는 경우 (403 Forbidden)
   */
  get hasNoPermission(): boolean {
    return this.statusCode === 403;
  }

  /**
   * 리소스를 찾을 수 없는 경우 (404 Not Found)
   */
  get hasNoResource(): boolean {
    return this.statusCode === 404;
  }

  /**
   * 서버 에러인 경우 (500번대)
   */
  get isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /**
   * 일반적인 클라이언트 에러 (400, 422)
   */
  get isCommonError(): boolean {
    return this.statusCode === 400 || this.statusCode === 422;
  }

  /**
   * AxiosError를 분석하여 적절한 커스텀 에러로 변환
   */
  static fromAxiosError(error: AxiosError<ApiResponse<unknown>>): ApiError {
    // HTTP 응답이 있는 경우 (4xx, 5xx 에러)
    if (error.response) {
      const { status, data } = error.response;
      const serverMessage = data?.message || data?.error || null;

      // errorCode는 response data에서 타입 가드를 사용하여 안전하게 추출
      const errorCode =
        isErrorResponse(data) && data.code
          ? (data.code as ErrorCode)
          : undefined;

      // 사용자에게 보여줄 메시지 결정
      const message =
        serverMessage ||
        ERROR_MESSAGES[status] ||
        '비식별 서버 에러가 발생했습니다';

      return new ApiError(message, status, errorCode, data);
    }

    // 타임아웃 에러
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new ApiError(
        '요청 시간이 초과되었습니다',
        0,
        ERROR_CODES.TIMEOUT_ERROR,
      );
    }

    // 네트워크 에러
    if (error.message === 'Network Error' || !error.response) {
      return new ApiError(
        '네트워크 연결이 없습니다',
        0,
        ERROR_CODES.NETWORK_ERROR,
      );
    }

    // 기타 알 수 없는 에러
    return new ApiError(
      '알 수 없는 서비스 오류가 발생했습니다',
      0,
      ERROR_CODES.UNKNOWN_ERROR,
    );
  }
}
