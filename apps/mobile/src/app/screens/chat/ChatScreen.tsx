import { View } from 'react-native';
import { Text, tw } from '@mockly/design-system';

export const ChatScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center`} testID="chat-screen">
      <Text variant="h2" weight="bold">
        채팅
      </Text>
    </View>
  );
};
