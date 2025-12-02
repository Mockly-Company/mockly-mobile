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

const styles = {
  primary: {
    card: tw`rounded-xl mb-sm`,
    title: tw`font-bold text-white`,
    subtitle: tw`mt-xs text-white/90`,
  },
  surface: {
    card: tw`rounded-xl mb-sm bg-surface dark:bg-surface-dark border border-border dark:border-border-dark`,
    title: tw`font-bold text-text dark:text-white`,
    subtitle: tw`mt-xs text-text-secondary dark:text-text-secondary-dark`,
  },
};
const CARD_GRADIENT_COLORS = ['#8A4FFF', '#4A90E2'];
export const QuickStartAction: React.FC<QuickStartActionProps> = ({
  title,
  subtitle,
  variant = 'surface',
  onPress,
}) => {
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
        style={styles[variant].card}
        gradientColors={
          variant === 'primary' ? CARD_GRADIENT_COLORS : undefined
        }
      >
        <Text variant="h4" style={styles[variant].title}>
          {title}
        </Text>
        <Text variant="body" style={styles[variant].subtitle}>
          {subtitle}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};
