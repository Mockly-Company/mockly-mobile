import { AppError, ErrorCoverage, ErrorCode } from '@shared/errors';

/**
 * unknown 에러를 AppError로 변환
 * AxiosError의 경우 자동으로 statusCode를 ErrorCode로 매핑
 *
 * @deprecated AppError.fromUnknownError() 사용 권장
 * @param displayMessage - 사용자에게 표시할 메시지
 * @param coverage - 에러 범위 (GLOBAL, SCREEN, COMPONENT, LOGGING)
 * @param err - 원본 에러
 * @param code - (선택) 명시적 ErrorCode 지정
 * @returns AppError 인스턴스
 */
export const toAppError = (
  displayMessage: string,
  coverage: ErrorCoverage,
  err: unknown,
  code?: ErrorCode,
): AppError => {
  return AppError.fromUnknownError(err, coverage, displayMessage, code);
};
