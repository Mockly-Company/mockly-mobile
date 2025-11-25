import React, { ReactNode } from 'react';

import RNRestart from 'react-native-restart';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalErrorFallback } from '../fallback';
import { isAppError, isLoggingError } from '../utils';
import { logger } from '@shared/utils/logger';

interface Props {
  children: ReactNode;
}

/**
 * 앱 전체를 감싸는 최상위 에러 바운더리
 * 모든 에러를 최종적으로 처리
 */
export function GlobalErrorBoundary({ children }: Props): React.ReactElement {
  const handleRetry = (): void => {
    // 앱 전체 상태 초기화 로직이 필요한 경우 여기에 추가
    // 예: 모든 store reset, AsyncStorage 클리어 등
    RNRestart.restart();
  };

  const handleError = (error: Error) => {
    logger.error('글로벌 에러 발생', error);

    if (isLoggingError(error)) {
      logger.error('글로벌 로깅 에러', error);
      return;
    }
    if (isAppError(error)) {
      return;
    }
    // 식별되지 않은 에러들 로깅
    logger.error('식별되지 않은 에러', error);
  };

  return (
    <ErrorBoundary
      onReset={handleRetry}
      onError={handleError}
      FallbackComponent={({ error }) => {
        return isAppError(error) ? (
          <GlobalErrorFallback
            title={error.name}
            message={error.displayMessage || error.message}
          />
        ) : (
          children
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
