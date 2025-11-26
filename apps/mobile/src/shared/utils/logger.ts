/**
 * 로깅 유틸리티
 * 개발 환경에서는 console에 출력하고, 프로덕션에서는 로깅 서비스(Sentry 등)로 전송
 */

export const logger = {
  error: (message: string, error?: unknown) => {
    if (__DEV__) {
      console.log(`[ERROR] ${message}`, error);
    }
    // TODO: 프로덕션에서는 Sentry로만 전송
    // if (!isDevelopment) {
    //   Sentry.captureMessage(message, { level: 'error', extra: { error } });
    // }
  },

  logException: (error: unknown, context?: Record<string, unknown>) => {
    const message =
      error instanceof Error ? error.message : String(error || 'Unknown error');

    if (__DEV__) {
      console.log(`[EXCEPTION]`, message, {
        error,
        context,
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
    // TODO: 프로덕션에서는 Sentry로만 전송
    // if (!isDevelopment) {
    //   Sentry.captureException(error, { extra: context });
    // }
  },

  warn: (message: string, data?: unknown) => {
    if (__DEV__) {
      console.warn(`[WARN] ${message}`, data);
    }
    // TODO: Sentry.captureMessage(message, 'warning');
  },
};
