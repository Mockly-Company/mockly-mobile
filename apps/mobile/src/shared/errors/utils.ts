import { AppError, ErrorCoverage, ErrorCode } from './AppError';

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};
export const isComponentError = (error: unknown): error is AppError => {
  if (isAppError(error) && error.coverage === ErrorCoverage.COMPONENT) {
    return true;
  }
  return false;
};
export const isScreenError = (error: unknown): error is AppError => {
  if (isAppError(error) && error.coverage === ErrorCoverage.SCREEN) {
    return true;
  }
  return false;
};
export const isLoggingError = (error: unknown): error is AppError => {
  if (isAppError(error) && error.coverage === ErrorCoverage.LOGGING) {
    return true;
  }
  return false;
};

const StatusCodeToErrorCodeMap: { [key: number]: ErrorCode } = {
  // 4xx: Client Errors
  400: ErrorCode.BAD_REQUEST,
  401: ErrorCode.UNAUTHORIZED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  422: ErrorCode.VALIDATION_ERROR,
  429: ErrorCode.TOO_MANY_REQUESTS,
  // 5xx: Server Errors
  500: ErrorCode.INTERNAL_SERVER_ERROR,
  502: ErrorCode.BAD_GATEWAY,
  503: ErrorCode.SERVICE_UNAVAILABLE,
  504: ErrorCode.GATEWAY_TIMEOUT,
};

/**
 * HTTP 상태 코드를 ErrorCode로 매핑
 */
export const mapStatusCodeToErrorCode = (statusCode: number): ErrorCode => {
  if (statusCode in StatusCodeToErrorCodeMap) {
    return StatusCodeToErrorCodeMap[statusCode];
  }
  if (statusCode >= 400 && statusCode < 500) {
    return ErrorCode.BAD_REQUEST;
  }
  if (statusCode >= 500) {
    return ErrorCode.INTERNAL_SERVER_ERROR;
  }
  return ErrorCode.UNKNOWN;
};

const ErrorToMessageMap: { [key in ErrorCode]: string } = {
  // 4xx: Client Errors
  [ErrorCode.BAD_REQUEST]: '잘못된 요청입니다. 다시 시도해주세요.',
  [ErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ErrorCode.FORBIDDEN]: '접근 권한이 없습니다.',
  [ErrorCode.NOT_FOUND]: '요청하신 정보를 찾을 수 없습니다.',
  [ErrorCode.VALIDATION_ERROR]: '입력하신 정보가 올바르지 않습니다.',
  [ErrorCode.TOO_MANY_REQUESTS]:
    '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',

  // 5xx: Server Errors
  [ErrorCode.INTERNAL_SERVER_ERROR]:
    '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.BAD_GATEWAY]: '서버 연결에 문제가 있습니다.',
  [ErrorCode.SERVICE_UNAVAILABLE]: '서비스를 일시적으로 사용할 수 없습니다.',
  [ErrorCode.GATEWAY_TIMEOUT]: '서버 응답 시간이 초과되었습니다.',

  // Network Errors
  [ErrorCode.TIMEOUT]: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  [ErrorCode.NO_INTERNET]: '인터넷 연결을 확인해주세요.',
  [ErrorCode.NETWORK_ERROR]: '네트워크 오류가 발생했습니다.',

  [ErrorCode.UNKNOWN]: '알 수 없는 오류가 발생했습니다.',
};

/**
 * ErrorCode별 기본 사용자 메시지
 */
export const getDefaultErrorMessage = (code: ErrorCode): string => {
  return ErrorToMessageMap[code];
};
