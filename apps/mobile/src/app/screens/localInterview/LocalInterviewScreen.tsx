import { View, Text } from 'react-native';
import { tw } from '@mockly/design-system';

export const LocalInterviewScreen = () => {
  return (
    <View
      style={tw`flex-1 justify-center items-center`}
      testID="local-interview-screen"
    >
      <Text style={tw`text-2xl font-bold`}>동네면접</Text>
    </View>
  );
};
