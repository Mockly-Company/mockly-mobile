import React from 'react';
import { ScreenErrorBoundary } from '@errors/boundaries';

export function withScreenErrorBoundary<P extends Record<string, unknown>>(
  Wrapped: React.ComponentType<P>,
) {
  const name = Wrapped.displayName || Wrapped.name || 'Screen';

  const ComponentWithBoundary: React.FC<P> = props => {
    return (
      <ScreenErrorBoundary screenName={name}>
        <Wrapped {...props} />
      </ScreenErrorBoundary>
    );
  };

  ComponentWithBoundary.displayName = name;
  return ComponentWithBoundary;
}
