import { View, TouchableOpacity } from 'react-native';
import { Text, tw, Card } from '@mockly/design-system';
import Feather from '@react-native-vector-icons/feather';

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
          <View
            style={tw`w-12 h-12 rounded-full bg-primary/10 items-center justify-center`}
          >
            <Text style={tw`text-2xl`}>{icon}</Text>
          </View>
          <View style={tw`flex-1`}>
            <Text
              variant="body"
              weight="bold"
              color="text"
              style={tw`text-lg mb-xs`}
            >
              {title}
            </Text>
            <Text variant="caption" color="secondary">
              {description}
            </Text>
          </View>
          <Feather
            name={'arrow-right'}
            size={24}
            style={tw`text-primary text-lg`}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
