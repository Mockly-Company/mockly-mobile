import React, { ReactNode, useCallback } from 'react';

import RNRestart from 'react-native-restart';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { GlobalErrorFallback } from '../fallback';
import { logger } from '@utils/logger';
import { AppError } from '../AppError';

interface Props {
  children: ReactNode;
}

/**
 * 앱 전체를 감싸는 최상위 에러 바운더리
 * 모든 에러를 최종적으로 처리
 */
export function GlobalErrorBoundary({ children }: Props): React.ReactElement {
  const handleRetry = useCallback(() => {
    // 앱 전체 상태 초기화 로직이 필요한 경우 여기에 추가
    RNRestart.restart();
  }, []);

  const handleError = useCallback((error: Error) => {
    if (AppError.isApiError(error)) {
      return;
    }

    logger.logException(error, { boundary: 'GlobalErrorBoundary' });
  }, []);

  return (
    <ErrorBoundary
      onReset={handleRetry}
      onError={handleError}
      FallbackComponent={GlobalErrorFallbackWrapper}
    >
      {children}
    </ErrorBoundary>
  );
}
const GlobalErrorFallbackWrapper = ({ error }: FallbackProps) => {
  const message = AppError.isAppError(error)
    ? error.displayMessage || error.message
    : error.message;
  return <GlobalErrorFallback title={error.name} message={message} />;
};
