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
  const [titleStyle, subtitleStyle] = React.useMemo(() => {
    if (variant === 'primary') {
      return [tw`text-white`, tw`text-white/90`];
    }
    return [undefined, undefined];
  }, [variant]);

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
        gradientColors={
          variant === 'primary' ? CARD_GRADIENT_COLORS : undefined
        }
      >
        <Text variant="h4" color="text" weight="bold" style={titleStyle}>
          {title}
        </Text>
        <Text variant="body" color="textSecondary" style={subtitleStyle}>
          {subtitle}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};
