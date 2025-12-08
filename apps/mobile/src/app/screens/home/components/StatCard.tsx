import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Card, Text, tw } from '@mockly/design-system';
import { cva, type VariantProps } from 'cva';

export type StatColor = 'primary' | 'success' | 'secondary';

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

type CardVariantProps = VariantProps<typeof cardVariants>;
interface StatCardProps extends CardVariantProps {
  label: string;
  value: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color = 'primary',
}) => {
  const cardStyle = useMemo(() => tw.style(cardVariants({ color })), [color]);

  return (
    <Card variant="filled" style={cardStyle}>
      <View style={tw`gap-xs`}>
        <Text variant="caption" color="textSecondary">
          {label}
        </Text>
        <Text variant="h2" weight="bold" color={color}>
          {value}
        </Text>
      </View>
    </Card>
  );
};
