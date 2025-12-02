/**
 * 앱 전체에서 사용하는 커스텀 에러 클래스
 */

import { AxiosError } from '@mockly/api';

export enum ErrorCoverage {
  /** Global - 앱 전체 재시작 필요 */
  GLOBAL = 'GLOBAL',
  /** Screen - 화면 단위 재시도 필요 */
  SCREEN = 'SCREEN',
  /** Component - 해당 컴포넌트만 재시도 */
  COMPONENT = 'COMPONENT',
  /** None - 에러 바운더리로 보내지 않음 (직접 처리) */
  NONE = 'NONE',
}

/**
 * HTTP 에러 코드
 */
export enum ErrorCode {
  // 4xx: Client Errors
  BAD_REQUEST = 'BAD_REQUEST', // 400
  UNAUTHORIZED = 'UNAUTHORIZED', // 401
  FORBIDDEN = 'FORBIDDEN', // 403
  NOT_FOUND = 'NOT_FOUND', // 404
  VALIDATION_ERROR = 'VALIDATION_ERROR', // 422
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS', // 429

  // 5xx: Server Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR', // 500
  BAD_GATEWAY = 'BAD_GATEWAY', // 502
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 503
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT', // 504

  // Network Errors
  TIMEOUT = 'TIMEOUT',
  NO_INTERNET = 'NO_INTERNET',
  NETWORK_ERROR = 'NETWORK_ERROR',

  // Unknown
  UNKNOWN = 'UNKNOWN',
}

/**
 * 앱 에러 클래스
 */
export class AppError extends Error {
  public readonly coverage: ErrorCoverage;
  public readonly timestamp: Date;
  public readonly displayMessage?: string;
  public readonly code: ErrorCode;
  public readonly statusCode?: number;
  public readonly isApiError: boolean;

  constructor(
    error: unknown,
    coverage: ErrorCoverage,
    displayMessage?: string,
    code: ErrorCode = ErrorCode.UNKNOWN,
    statusCode?: number,
    isApiError: boolean = false,
  ) {
    const sanitizeErrorMessage = AppError.sanitizeErrorMessage(
      error instanceof Error ? error.message : String(error),
    );
    super(sanitizeErrorMessage);
    if (error instanceof Error) {
      this.name = error.name;
      this.stack = error.stack;
    } else {
      this.name = 'AppError';
    }

    this.coverage = coverage;
    this.timestamp = new Date();
    this.displayMessage = displayMessage;
    this.message = displayMessage || sanitizeErrorMessage;
    this.code = code;
    this.statusCode = statusCode;
    this.isApiError = isApiError;

    // Error 프로토타입 체인 유지
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static fromAxiosError(
    err: AxiosError,
    coverage: ErrorCoverage,
    displayMessage?: string,
  ): AppError {
    const statusCode = err?.response?.status || 0;
    let code = ErrorCode.NETWORK_ERROR;

    // 타임아웃 에러 체크
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      code = ErrorCode.TIMEOUT;
    } else if (statusCode) {
      // statusCode to ErrorCode 매핑
      const statusToCodeMap: Record<number, ErrorCode> = {
        400: ErrorCode.BAD_REQUEST,
        401: ErrorCode.UNAUTHORIZED,
        403: ErrorCode.FORBIDDEN,
        404: ErrorCode.NOT_FOUND,
        422: ErrorCode.VALIDATION_ERROR,
        429: ErrorCode.TOO_MANY_REQUESTS,
        500: ErrorCode.INTERNAL_SERVER_ERROR,
        502: ErrorCode.BAD_GATEWAY,
        503: ErrorCode.SERVICE_UNAVAILABLE,
        504: ErrorCode.GATEWAY_TIMEOUT,
      };

      code =
        statusToCodeMap[statusCode] ||
        (statusCode >= 400 && statusCode < 500
          ? ErrorCode.BAD_REQUEST
          : ErrorCode.INTERNAL_SERVER_ERROR);
    }

    // 서버 응답 메시지 추출 (있는 경우)
    const response = err.response?.data as
      | { message?: string; error?: string }
      | undefined;
    const serverMessage = response?.message || response?.error;
    const finalDisplayMessage = displayMessage || serverMessage;

    return new AppError(
      err,
      coverage,
      finalDisplayMessage,
      code,
      statusCode,
      true,
    );
  }

  static fromUnknownError(
    err: unknown,
    coverage: ErrorCoverage,
    displayMessage?: string,
    code?: ErrorCode,
  ): AppError {
    // 이미 AppError면 그대로 반환
    if (err instanceof AppError) {
      return err;
    }

    // AxiosError 처리 (동적 import 피하기 위해 duck typing)
    if (
      err &&
      typeof err === 'object' &&
      'response' in err &&
      'config' in err &&
      'isAxiosError' in err
    ) {
      return AppError.fromAxiosError(
        err as AxiosError,
        coverage,
        displayMessage,
      );
    }

    // 일반 에러
    return new AppError(err, coverage, displayMessage, code);
  }

  static fromNetworkError(
    err: unknown,
    coverage: ErrorCoverage,
    displayMessage?: string,
  ): AppError {
    return new AppError(err, coverage, displayMessage, ErrorCode.NETWORK_ERROR);
  }

  static fromTimeoutError(
    err: unknown,
    coverage: ErrorCoverage,
    displayMessage?: string,
  ): AppError {
    return new AppError(err, coverage, displayMessage, ErrorCode.TIMEOUT);
  }

  // API 에러 헬퍼 메서드들

  /**
   * 토큰 갱신이 필요한 경우 (401 Unauthorized)
   */
  get shouldRefreshToken(): boolean {
    return this.isApiError && this.statusCode === 401;
  }

  /**
   * 재로그인이 필요한 경우 (401 에러)
   */
  get shouldReLogin(): boolean {
    return this.isApiError && this.statusCode === 401;
  }

  /**
   * 네트워크 연결 에러인 경우 (타임아웃 또는 네트워크 에러)
   */
  get isConnectionError(): boolean {
    return (
      this.isApiError &&
      (this.code === ErrorCode.NETWORK_ERROR || this.code === ErrorCode.TIMEOUT)
    );
  }

  /**
   * 권한이 없는 경우 (403 Forbidden)
   */
  get hasNoPermission(): boolean {
    return this.isApiError && this.statusCode === 403;
  }

  /**
   * 리소스를 찾을 수 없는 경우 (404 Not Found)
   */
  get hasNoResource(): boolean {
    return this.isApiError && this.statusCode === 404;
  }

  /**
   * 서버 에러인 경우 (500번대)
   */
  get isServerError(): boolean {
    return (
      this.isApiError &&
      !!this.statusCode &&
      this.statusCode >= 500 &&
      this.statusCode < 600
    );
  }

  /**
   * 일반적인 클라이언트 에러 (400, 422)
   */
  get isCommonError(): boolean {
    return (
      this.isApiError && (this.statusCode === 400 || this.statusCode === 422)
    );
  }

  // Static 타입 가드 메서드들

  /**
   * AppError 타입 가드
   */
  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }
  /**
   * AppError 타입 가드
   */
  static isNotBoundaryError(error: unknown): error is AppError {
    return error instanceof AppError && error.coverage === ErrorCoverage.NONE;
  }
  /**
   * Component 레벨 에러 확인
   */
  static isComponentError(error: unknown): error is AppError {
    return (
      error instanceof AppError && error.coverage === ErrorCoverage.COMPONENT
    );
  }

  /**
   * Screen 레벨 에러 확인
   */
  static isScreenError(error: unknown): error is AppError {
    return error instanceof AppError && error.coverage === ErrorCoverage.SCREEN;
  }

  /**
   * Global 레벨 에러 확인
   */
  static isGlobalError(error: unknown): error is AppError {
    return error instanceof AppError && error.coverage === ErrorCoverage.GLOBAL;
  }

  /**
   * API 에러 확인
   */
  static isApiError(error: unknown): error is AppError {
    return error instanceof AppError && error.isApiError;
  }

  // 토큰, API 키 등 제거
  private static sanitizeErrorMessage(message: string): string {
    return message
      .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, 'Bearer [REDACTED]')
      .replace(/api[_-]?key[:\s]*[A-Za-z0-9]+/gi, 'api_key: [REDACTED]');
  }
}
