/**
 * OTP 인증 관련 에러 코드
 */

import z from 'zod';

// OTP 메시지 전송 에러 코드
export enum OTPSendErrorCode {
  /** 올바른 휴대폰 번호 형식이 아닙니다 */
  INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
  /** 휴대폰 번호는 3개월에 한 번만 변경 가능합니다 */
  PHONE_CHANGE_NOT_ALLOWED = 'PHONE_CHANGE_NOT_ALLOWED',
  /** 너무 빈번한 요청 */
  REQUEST_TOO_FREQUENT = 'REQUEST_TOO_FREQUENT',
  /** 하루 SMS 전송 제한 초과 */
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// OTP 인증 검증 에러 코드
export enum OTPVerifyErrorCode {
  /** 인증 번호가 일치하지 않습니다 */
  INVALID_CODE = 'INVALID_CODE',
  /** 인증 번호가 만료되었습니다 */
  CODE_EXPIRED = 'CODE_EXPIRED',
  /** 인증 시도 횟수 초과 */
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  /** 이미 인증된 계정입니다 */
  ALREADY_VERIFIED = 'ALREADY_VERIFIED',
  /** 인증 요청 기록이 없습니다 */
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
}

// 모든 OTP 에러 코드
export type OTPErrorCode = OTPSendErrorCode | OTPVerifyErrorCode;

/**
 * OTP 에러 메시지 매핑
 */
export const OTP_ERROR_MESSAGES: Record<OTPErrorCode, string> = {
  // OTP 전송 에러
  [OTPSendErrorCode.INVALID_PHONE_FORMAT]: '올바른 휴대폰 번호 형식이 아닙니다.',
  [OTPSendErrorCode.PHONE_CHANGE_NOT_ALLOWED]: '휴대폰 번호는 3개월에 한 번만 변경 가능합니다.',
  [OTPSendErrorCode.REQUEST_TOO_FREQUENT]: '잠시 후 다시 시도해주세요.',
  [OTPSendErrorCode.RATE_LIMIT_EXCEEDED]: '하루 SMS 전송 제한을 초과하였습니다. (5회 제한)',

  // OTP 검증 에러
  [OTPVerifyErrorCode.INVALID_CODE]: '인증 번호가 일치하지 않습니다.',
  [OTPVerifyErrorCode.CODE_EXPIRED]: '인증 번호가 만료되었습니다. 다시 요청해주세요.',
  [OTPVerifyErrorCode.TOO_MANY_REQUESTS]:
    '인증 시도 횟수를 초과했습니다. 다시 인증번호를 요청해주세요.',
  [OTPVerifyErrorCode.ALREADY_VERIFIED]: '이미 인증된 계정입니다.',
  [OTPVerifyErrorCode.RESOURCE_NOT_FOUND]:
    '인증 요청 기록이 없습니다. 먼저 인증번호를 요청해주세요.',
};

/**
 * 에러 코드에서 사용자 친화적 메시지 추출
 */
export function getOTPErrorMessage(errorCode: OTPErrorCode, serverMessage?: string): string {
  // 서버에서 제공한 메시지가 있으면 우선 사용
  if (serverMessage) {
    return serverMessage;
  }
  // 아니면 매핑된 기본 메시지 사용
  return OTP_ERROR_MESSAGES[errorCode] || '알 수 없는 오류가 발생했습니다.';
}

/**
 * 에러 메시지에서 남은 시도 횟수 추출
 * @example "인증 번호가 일치하지 않습니다. (남은 시도: 4회)" -> 4
 */
export function extractRemainingAttempts(message: string): number | null {
  const match = message.match(/남은 시도:\s*(\d+)회/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * 에러 메시지에서 다음 변경 가능일 추출
 * @example "휴대폰 번호는 3개월에 한 번만 변경 가능합니다. (다음 변경 가능일: 2025-04-03)" -> "2025-04-03"
 */
export function extractNextAvailableDate(message: string): string | null {
  const match = message.match(/다음 변경 가능일:\s*(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

/**
 * OTP 코드 스키마 (6자리 숫자)
 */
export const OTPCodeSchema = z
  .string()
  .length(6, '6자리 인증번호를 입력해주세요.')
  .regex(/^\d{6}$/, '인증번호는 숫자만 입력 가능합니다.');

export type OTPCode = z.infer<typeof OTPCodeSchema>;
