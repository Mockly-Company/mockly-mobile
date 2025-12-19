import React, { ReactNode, useState } from 'react';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ComponentErrorFallback, ResourceNotFoundFallback } from '../fallback';
import { AppError } from '../AppError';
import { logger } from '@utils/logger';

interface Props {
  children: ReactNode;
}

/**
 * 컴포넌트 단위 에러 바운더리
 * API 호출 실패 등 경미한 에러를 컴포넌트 내부에서 처리
 * ComponentError만 처리하고, 나머지는 상위로 전파
 */
export function ComponentErrorBoundary({
  children,
}: Props): React.ReactElement {
  const [remountKey, setRemountKey] = useState(0);

  const handleReset = async () => {
    setRemountKey(prev => prev + 1);
  };

  const handleError = (error: Error) => {
    if (AppError.isApiError(error)) {
      if (error.isServerError) {
        throw error;
      }
      return;
    }

    if (AppError.isAppError(error)) {
      if (AppError.isComponentError(error)) {
        logger.logException(error, { boundary: 'ComponentErrorBoundary' });
        return;
      }
      throw error;
    }

    // 알 수 없는 에러는 로깅
    logger.logException(error, {
      boundary: 'ComponentErrorBoundary',
      type: 'unknown',
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={ComponentErrorFallbackWrapper}
      resetKeys={[remountKey]}
      onReset={handleReset}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}

const ComponentErrorFallbackWrapper = ({ error }: FallbackProps) => {
  // ApiError의 404는 ResourceNotFoundFallback
  if (AppError.isApiError(error) && error.hasNoResource) {
    return <ResourceNotFoundFallback message={error.message} />;
  }
  // 기타 에러는 ComponentErrorFallback
  return (
    <ComponentErrorFallback message={error.displayMessage || error.message} />
  );
};
