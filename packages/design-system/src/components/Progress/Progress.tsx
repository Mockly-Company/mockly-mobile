import React, { createContext, useContext, useMemo } from 'react';

import { ProgressBar } from './Progress.Bar';
import { ProgressCircle } from './Progress.Circle';

type ProgressVariant = 'primary' | 'success' | 'warning' | 'error';

type ProgressContextValue = {
  percent: number;
  variant: ProgressVariant;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('Progress.* must be used inside <Progress>');
  }
  return ctx;
};

type ProgressProps = {
  value: number;
  max?: number;
  variant?: ProgressVariant | 'auto';
  children: React.ReactNode;
};

const getAutoVariant = (percent: number): ProgressVariant => {
  if (percent >= 85) return 'error';
  if (percent >= 50) return 'warning';
  if (percent >= 25) return 'success';
  return 'error';
};

const ProgressRoot = ({ value, max = 100, variant = 'auto', children }: ProgressProps) => {
  const percent = Math.min(Math.max((value / (max || 1)) * 100, 0), 100);

  const finalVariant = useMemo(
    () => (variant === 'auto' ? getAutoVariant(percent) : variant),
    [variant, percent]
  );

  return (
    <ProgressContext.Provider value={{ percent, variant: finalVariant }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const Progress = Object.assign(ProgressRoot, {
  Bar: ProgressBar,
  Circle: ProgressCircle,
});
