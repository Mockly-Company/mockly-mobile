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
      <Card
        variant="transparent"
        padding="md"
        style={tw`rounded-xl bg-surface border border-border dark:bg-surface-dark dark:border-border-dark`}
      >
        <View style={tw`flex-row items-center gap-md`}>
          <View
            style={tw`w-12 h-12 rounded-full bg-primary/10 items-center justify-center`}
          >
            <Text style={tw`text-2xl`}>{icon}</Text>
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`font-bold text-lg mb-xs text-text dark:text-white`}>
              {title}
            </Text>
            <Text style={tw`text-sm text-text-secondary dark:text-gray-400`}>
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
