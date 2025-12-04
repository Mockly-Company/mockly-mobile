import { View, Text } from 'react-native';
import { tw } from '@mockly/design-system';

export const ChatScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center`} testID="chat-screen">
      <Text style={tw`text-2xl font-bold`}>채팅</Text>
    </View>
  );
};
