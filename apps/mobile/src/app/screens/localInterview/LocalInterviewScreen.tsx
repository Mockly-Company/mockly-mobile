import { View } from 'react-native';
import { tw, Text } from '@mockly/design-system';

export const LocalInterviewScreen = () => {
  return (
    <View
      style={tw`flex-1 justify-center items-center`}
      testID="local-interview-screen"
    >
      <Text variant="h2" weight="bold">
        동네면접
      </Text>
    </View>
  );
};
