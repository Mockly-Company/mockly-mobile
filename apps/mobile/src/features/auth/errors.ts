/**
 * 인증 에러 타입 정의
 */

export class AuthError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

// 팩토리 함수 방식 - 필요할 때만 생성
export const AUTH_ERRORS = {
  CANCELLED: () =>
    new AuthError('Authorization Code 획득에 실패했습니다.', 'AUTH_CANCELLED'),
  TOKEN_EXCHANGE_FAILED: () =>
    new AuthError('토큰 교환에 실패했습니다.', 'TOKEN_EXCHANGE_FAILED'),
  TOKEN_REFRESH_FAILED: () =>
    new AuthError('토큰 갱신에 실패했습니다.', 'TOKEN_REFRESH_FAILED'),
  NOT_IMPLEMENTED: (provider: string) =>
    new AuthError(
      `${provider} 로그인은 아직 구현되지 않았습니다.`,
      'NOT_IMPLEMENTED',
    ),
} as const;
