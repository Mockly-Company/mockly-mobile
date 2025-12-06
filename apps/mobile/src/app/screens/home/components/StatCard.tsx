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

const cardVariants = cva({
  base: 'p-md rounded-xl border',
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

const valueVariants = cva({
  base: 'font-bold',
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

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color = 'primary',
}) => {
  const cardStyle = useMemo(() => tw.style(cardVariants({ color })), [color]);
  const valueStyle = useMemo(() => tw.style(valueVariants({ color })), [color]);

  return (
    <Card variant="filled" style={cardStyle}>
      <View style={tw`gap-xs`}>
        <Text
          variant="caption"
          style={tw`text-text-secondary dark:text-gray-400`}
        >
          {label}
        </Text>
        <Text variant="h2" style={valueStyle}>
          {value}
        </Text>
      </View>
    </Card>
  );
};
