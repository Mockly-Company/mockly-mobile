import { View, Text } from 'react-native';
import { tw } from '@mockly/design-system';

export const InterviewScreen = () => {
  return (
    <View
      style={tw`flex-1 justify-center items-center`}
      testID="interview-screen"
    >
      <Text style={tw`text-2xl font-bold`}>면접</Text>
    </View>
  );
};
