import { View, Text } from 'react-native';
import { tw } from '@mockly/design-system';

const containerStyle = tw`flex-1 justify-center items-center bg-white`;
const titleStyle = tw`text-2xl font-bold`;

export const LocalInterviewScreen = () => {
  return (
    <View style={containerStyle} testID="local-interview-screen">
      <Text style={titleStyle}>동네면접</Text>
    </View>
  );
};
