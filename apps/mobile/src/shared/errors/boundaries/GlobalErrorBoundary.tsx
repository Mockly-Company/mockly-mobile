import React, { ReactNode } from 'react';

import RNRestart from 'react-native-restart';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalErrorFallback } from '../fallback';
import { logger } from '@shared/utils/logger';
import { AppError } from '../AppError';

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
    RNRestart.restart();
  };

  const handleError = (error: Error) => {
    if (AppError.isApiError(error)) {
      return;
    }

    logger.logException(error, { boundary: 'GlobalErrorBoundary' });
  };

  return (
    <ErrorBoundary
      onReset={handleRetry}
      onError={handleError}
      FallbackComponent={({ error }) => {
        return (
          <GlobalErrorFallback
            title={error.name}
            message={error.displayMessage || error.message}
          />
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
