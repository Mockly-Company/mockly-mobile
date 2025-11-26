/**
 * 로깅 유틸리티
 * 개발 환경에서는 console에 출력하고, 프로덕션에서는 로깅 서비스(Sentry 등)로 전송
 */

export const logger = {
  /**
   * 에러 로깅 (메시지 기반)
   */
  error: (message: string, error?: unknown) => {
    // TODO: Sentry.captureException(error, { tags: { message } });
    console.log(`[ERROR] ${message}`, error);
  },

  /**
   * 에러 객체 로깅
   */
  logException: (error: unknown, context?: Record<string, unknown>) => {
    const message =
      error instanceof Error ? error.message : String(error || 'Unknown error');
    // TODO: Sentry.captureException(error, { extra: context });
    console.log(`[EXCEPTION]`, message, {
      error,
      context,
      stack: error instanceof Error ? error.stack : undefined,
    });
  },

  /**
   * 경고 로깅
   */
  warn: (message: string, data?: unknown) => {
    // TODO: Sentry.captureMessage(message, 'warning');
    console.warn(`[WARN] ${message}`, data);
  },
};
