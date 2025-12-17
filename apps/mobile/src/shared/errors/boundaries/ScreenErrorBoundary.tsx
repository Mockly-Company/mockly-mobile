import React, { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ScreenErrorFallback, ResourceNotFoundFallback } from '../fallback';
import { AppError } from '../AppError';
import { logger } from '@shared/utils/logger';

interface Props {
  children: ReactNode;
  screenName: string;
}

/**
 * 화면 단위 에러 바운더리
 * ScreenError만 처리하고, GlobalError는 상위로 전파
 */
export function ScreenErrorBoundary({
  children,
  screenName,
}: Props): React.ReactElement {
  const handleError = (error: Error) => {
    if (AppError.isApiError(error)) {
      if (error.isServerError) {
        throw error;
      }
      return;
    }

    if (AppError.isAppError(error)) {
      if (AppError.isScreenError(error)) {
        logger.logException(error, {
          boundary: 'ScreenErrorBoundary',
          screenName,
        });
        return;
      }

      throw error;
    }
    // 알 수 없는 에러는 로깅
    logger.logException(error, {
      boundary: 'ScreenErrorBoundary',
      screenName,
      type: 'unknown',
    });
  };

  return (
    <ErrorBoundary
      onError={handleError}
      FallbackComponent={({ error, resetErrorBoundary }) => {
        // NoResource 404는 ResourceNotFoundFallback
        if (AppError.isApiError(error) && error.hasNoResource) {
          return <ResourceNotFoundFallback message={error.message} />;
        }
        // 기타 에러는 ScreenErrorFallback
        return (
          <ScreenErrorFallback
            screenName={screenName}
            onRetry={resetErrorBoundary}
          />
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
