import { View, Text } from 'react-native';
import { spacing } from '../theme';
import { tw } from '../lib/tw';

export default {
  title: 'Foundation/Spacing',
};

const spacingKeys = Object.keys(spacing) as Array<keyof typeof spacing>;

export const SpacingTokens = () => (
  <View style={tw`p-4 bg-white dark:bg-gray-900`}>
    {spacingKeys.map(key => (
      <View key={key} style={tw`flex-row items-center mb-4`}>
        <View
          style={tw.style(`h-6 bg-gray-300 dark:bg-gray-600 rounded mr-4`, {
            width: spacing[key],
          })}
        />
        <Text style={tw`text-base min-w-15 text-gray-900 dark:text-white`}>{key}</Text>
        <Text style={tw`text-base text-gray-600 dark:text-gray-400`}>{spacing[key]} px</Text>
      </View>
    ))}
  </View>
);
