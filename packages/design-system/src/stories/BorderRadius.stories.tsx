import { View, Text } from 'react-native';
import { borderRadius } from '../theme';
import { tw } from '../lib/tw';

export default {
  title: '파운데이션/BorderRadius',
};

const radiusKeys = Object.keys(borderRadius) as Array<keyof typeof borderRadius>;

export const BorderRadiusTokens = () => (
  <View style={tw`p-4 bg-white dark:bg-gray-900`}>
    {radiusKeys.map(key => (
      <View key={key} style={tw`flex-row items-center mb-4`}>
        <View
          style={tw.style(
            `w-12 h-12 bg-gray-300 dark:bg-gray-600 mr-4 justify-center items-center`,
            {
              borderRadius: borderRadius[key],
            }
          )}
        />
        <Text style={tw`text-base min-w-15 text-gray-900 dark:text-white`}>{key}</Text>
        <Text style={tw`text-base text-gray-600 dark:text-gray-400`}>{borderRadius[key]} px</Text>
      </View>
    ))}
  </View>
);
