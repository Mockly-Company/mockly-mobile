import React from 'react';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { spacing as spacingValues } from '../theme';

type SpacingKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const spacingMap: Record<SpacingKey, number> = {
  xs: spacingValues.xs,
  sm: spacingValues.sm,
  md: spacingValues.md,
  lg: spacingValues.lg,
  xl: spacingValues.xl,
  xxl: spacingValues.xxl,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GridProps<T = any> extends Omit<FlatGridProps<T>, 'spacing'> {
  spacing?: SpacingKey;
}

export const Grid: React.FC<GridProps> = ({ spacing = 'md', ...props }) => {
  const spacingValue = spacingMap[spacing];

  return <FlatGrid spacing={spacingValue} {...props} />;
};
