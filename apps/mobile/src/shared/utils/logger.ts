/**
 * 로깅 유틸리티
 * 개발 환경에서는 console에 출력하고, 프로덕션에서는 로깅 서비스(Sentry 등)로 전송
 */

// eslint-disable-next-line no-undef
const isDev = __DEV__;

export const logger = {
  /**
   * 에러 로깅
   */
  error: (message: string, error?: unknown) => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      // TODO: Sentry.captureException(error, { tags: { message } });
      console.error(`[ERROR] ${message}`, error);
    }
  },

  /**
   * 경고 로깅
   */
  warn: (message: string, data?: unknown) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data);
    } else {
      // TODO: Sentry.captureMessage(message, 'warning');
      console.warn(`[WARN] ${message}`, data);
    }
  },

  /**
   * 정보 로깅
   */
  info: (message: string, data?: unknown) => {
    if (isDev) {
      console.info(`[INFO] ${message}`, data);
    }
    // 프로덕션에서는 info 로그를 남기지 않음
  },

  /**
   * 디버그 로깅
   */
  debug: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
};
