import { View } from 'react-native';
import { tw, Text } from '@mockly/design-system';

export const InterviewScreen = () => {
  return (
    <View
      style={tw`flex-1 justify-center items-center`}
      testID="interview-screen"
    >
      <Text variant="h2" weight="bold">
        면접
      </Text>
    </View>
  );
};
