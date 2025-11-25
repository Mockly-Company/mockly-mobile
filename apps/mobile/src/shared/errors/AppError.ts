/**
 * 앱 전체에서 사용하는 커스텀 에러 클래스
 */

export enum ErrorCoverage {
  /** Global - 앱 전체 재시작 필요 */
  GLOBAL = 'GLOBAL',
  /** Screen - 화면 단위 재시도 필요 */
  SCREEN = 'SCREEN',
  /** Component - 해당 컴포넌트만 재시도 */
  COMPONENT = 'COMPONENT',
  /** Logging - 로깅 전용 에러 */
  LOGGING = 'LOGGING',
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
 * coverage로 에러 레벨을 구분
 *
 * @example
 * // unknown 에러를 받아서 처리
 * try {
 *   await fetchData();
 * } catch (error) {
 *   throw new AppError(error, ErrorCoverage.COMPONENT);
 * }
 *
 * // 직접 메시지 지정
 * throw new AppError('데이터 로드 실패', ErrorCoverage.SCREEN, '데이터를 불러올 수 없습니다');
 *
 * // HTTP 에러 코드와 함께 사용
 * throw new AppError(error, ErrorCoverage.SCREEN, '접근 권한이 없습니다', ErrorCode.FORBIDDEN);
 *
 * // 팩토리 메서드 사용 (AxiosError)
 * import { AxiosError } from '@mockly/api';
 * if (err instanceof AxiosError) {
 *   throw AppError.fromAxiosError(err, ErrorCoverage.SCREEN, '데이터를 불러올 수 없습니다');
 * }
 */
export class AppError extends Error {
  public readonly coverage: ErrorCoverage;
  public readonly timestamp: Date;
  public readonly displayMessage?: string;
  public readonly code: ErrorCode;
  public readonly statusCode?: number;

  constructor(
    error: unknown,
    coverage: ErrorCoverage,
    displayMessage?: string,
    code: ErrorCode = ErrorCode.UNKNOWN,
    statusCode?: number,
  ) {
    const message = error instanceof Error ? error.message : String(error);
    super(message);
    if (error instanceof Error) {
      this.name = error.name;
      this.stack = error.stack;
    } else {
      this.name = 'AppError';
    }

    this.coverage = coverage;
    this.timestamp = new Date();
    this.displayMessage = displayMessage;
    this.code = code;
    this.statusCode = statusCode;

    // Error 프로토타입 체인 유지
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * AxiosError로부터 AppError 생성
   * statusCode를 자동으로 ErrorCode로 매핑
   *
   * @example
   * import { AxiosError } from '@mockly/api';
   * if (err instanceof AxiosError) {
   *   throw AppError.fromAxiosError(
   *     err,
   *     ErrorCoverage.SCREEN,
   *     '데이터를 불러올 수 없습니다'
   *   );
   * }
   */
  static fromAxiosError(
    err: { response?: { status?: number } },
    coverage: ErrorCoverage,
    displayMessage?: string,
  ): AppError {
    // 동적 import를 피하기 위해 직접 매핑
    const statusCode = err.response?.status;
    let code = ErrorCode.NETWORK_ERROR;

    if (statusCode) {
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

    return new AppError(err, coverage, displayMessage, code, statusCode);
  }

  /**
   * unknown 타입 에러로부터 AppError 생성
   * 이미 AppError면 그대로 반환, AxiosError면 fromAxiosError 사용
   *
   * @example
   * try {
   *   await someOperation();
   * } catch (err) {
   *   throw AppError.fromUnknownError(
   *     err,
   *     ErrorCoverage.COMPONENT,
   *     '작업을 완료할 수 없습니다'
   *   );
   * }
   */
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
        err as { response?: { status?: number } },
        coverage,
        displayMessage,
      );
    }

    // 일반 에러
    return new AppError(err, coverage, displayMessage, code);
  }

  /**
   * 네트워크 에러로부터 AppError 생성
   */
  static fromNetworkError(
    err: unknown,
    coverage: ErrorCoverage,
    displayMessage?: string,
  ): AppError {
    return new AppError(err, coverage, displayMessage, ErrorCode.NETWORK_ERROR);
  }

  /**
   * 타임아웃 에러로부터 AppError 생성
   */
  static fromTimeoutError(
    err: unknown,
    coverage: ErrorCoverage,
    displayMessage?: string,
  ): AppError {
    return new AppError(err, coverage, displayMessage, ErrorCode.TIMEOUT);
  }
}
