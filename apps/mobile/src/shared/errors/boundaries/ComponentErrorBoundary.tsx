import React, { ReactNode, useState } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { ComponentErrorFallback } from '../fallback';
import { isComponentError, isLoggingError } from '../utils';
import { logger } from '@shared/utils/logger';

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
    if (isLoggingError(error)) {
      logger.error('컴포넌트 로깅 에러', error);
      return;
    }
    if (isComponentError(error)) {
      return;
    }

    throw error;
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <ComponentErrorFallback
          message={error.displayMessage || error.message}
        />
      )}
      resetKeys={[remountKey]}
      onReset={handleReset}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
