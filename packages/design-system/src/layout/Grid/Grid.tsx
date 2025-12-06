import React from 'react';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { spacing as spacingValues } from '../../theme';

type SpacingKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const spacingMap: Record<SpacingKey, number> = {
  xs: spacingValues.xs,
  sm: spacingValues.sm,
  md: spacingValues.md,
  lg: spacingValues.lg,
  xl: spacingValues.xl,
  '2xl': spacingValues['2xl'],
};

export interface GridProps extends Omit<FlatGridProps, 'spacing'> {
  spacing?: SpacingKey;
}

export const Grid: React.FC<GridProps> = ({ spacing = 'md', ...props }) => {
  const spacingValue = spacingMap[spacing];

  return <FlatGrid spacing={spacingValue} {...props} />;
};
