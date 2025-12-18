import { View, TouchableOpacity } from 'react-native';
import { Text, tw, Card, Icon } from '@mockly/design-system';
import { PropsWithChildren } from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  onPress?: () => void;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  onPress,
}: FeatureCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint="기능 상세 화면으로 이동합니다"
    >
      <Card variant="outlined" padding="md" style={tw`rounded-xl`}>
        <View style={tw`flex-row items-center gap-md`}>
          <FeatureIcon>{icon}</FeatureIcon>

          <View style={tw`flex-1`}>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </View>

          <RightArrow />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const FeatureIcon = ({ children }: PropsWithChildren) => {
  return (
    <View
      style={tw`w-12 h-12 rounded-full bg-primary/10 items-center justify-center`}
    >
      <Text style={tw`text-2xl`}>{children}</Text>
    </View>
  );
};

const Title = ({ children }: PropsWithChildren) => {
  return (
    <Text variant="body" weight="bold" color="text" style={tw`text-lg mb-xs`}>
      {children}
    </Text>
  );
};

const Description = ({ children }: PropsWithChildren) => {
  return (
    <Text variant="caption" color="secondary">
      {children}
    </Text>
  );
};
const RightArrow = () => (
  <Icon name={'arrow-right'} size={24} style={tw`text-primary text-lg`} />
);
