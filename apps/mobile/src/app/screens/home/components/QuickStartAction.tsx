import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, tw, Card } from '@mockly/design-system';

type Variant = 'primary' | 'surface';

interface QuickStartActionProps {
  title: string;
  subtitle: string;
  variant?: Variant;
  onPress?: () => void;
}

const CARD_GRADIENT_COLORS = ['#8A4FFF', '#4A90E2'];

export const QuickStartAction: React.FC<QuickStartActionProps> = ({
  title,
  subtitle,
  variant = 'surface',
  onPress,
}) => {
  const cardStyle =
    variant === 'primary'
      ? tw`rounded-xl mb-sm`
      : tw`rounded-xl mb-sm bg-surface dark:bg-surface-dark border border-border dark:border-border-dark`;
  const titleStyle =
    variant === 'primary'
      ? tw`font-bold text-white`
      : tw`font-bold text-text dark:text-white`;
  const subtitleStyle =
    variant === 'primary'
      ? tw`mt-xs text-white/90`
      : tw`mt-xs text-text-secondary dark:text-text-secondary-dark`;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      accessibilityHint="빠른 시작 작업을 실행합니다"
    >
      <Card
        variant={variant === 'primary' ? 'gradient' : 'outlined'}
        padding="lg"
        style={cardStyle}
        gradientColors={
          variant === 'primary' ? CARD_GRADIENT_COLORS : undefined
        }
      >
        <Text variant="h4" style={titleStyle}>
          {title}
        </Text>
        <Text variant="body" style={subtitleStyle}>
          {subtitle}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};
