import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Card, Text, tw } from '@mockly/design-system';
import { cva } from 'cva';

export type StatColor = 'primary' | 'success' | 'secondary';

interface StatCardProps {
  label: string;
  value: string;
  color?: StatColor;
}

const cardVariants = cva('p-md rounded-xl border', {
  variants: {
    color: {
      primary: 'bg-primary/10 border-primary/20',
      success: 'bg-success/10 border-success/20',
      secondary: 'bg-secondary/10 border-secondary/20',
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});

const valueVariants = cva('font-bold', {
  variants: {
    color: {
      primary: 'text-primary',
      success: 'text-success',
      secondary: 'text-secondary',
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});

const styles = {
  container: tw`gap-xs`,
  label: tw`text-text-secondary dark:text-gray-400`,
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color = 'primary',
}) => {
  const cardStyle = useMemo(() => tw.style(cardVariants({ color })), [color]);
  const valueStyle = useMemo(() => tw.style(valueVariants({ color })), [color]);

  return (
    <Card variant="filled" style={cardStyle}>
      <View style={styles.container}>
        <Text variant="caption" style={styles.label}>
          {label}
        </Text>
        <Text variant="h2" style={valueStyle}>
          {value}
        </Text>
      </View>
    </Card>
  );
};
