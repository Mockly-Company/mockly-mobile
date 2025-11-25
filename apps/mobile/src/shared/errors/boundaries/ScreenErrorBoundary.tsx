import React, { ReactNode, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ScreenErrorFallback } from '../fallback';
import { isLoggingError, isScreenError } from '../utils';
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
  const [remountKey, setRemountKey] = useState(0);

  const handleReset = async () => {
    setRemountKey(prev => prev + 1);
  };

  const handleError = (error: Error) => {
    if (isLoggingError(error)) {
      logger.error('스크린 로깅 에러', error);
      return;
    }
    if (isScreenError(error)) {
      return;
    }

    throw error;
  };

  return (
    <ErrorBoundary
      resetKeys={[remountKey]}
      onReset={handleReset}
      onError={handleError}
      FallbackComponent={() => <ScreenErrorFallback screenName={screenName} />}
    >
      {children}
    </ErrorBoundary>
  );
}
