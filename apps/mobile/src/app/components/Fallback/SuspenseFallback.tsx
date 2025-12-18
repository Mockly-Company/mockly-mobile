import { tw } from '@mockly/design-system';
import { View, ActivityIndicator } from 'react-native';

export const SuspenseFallback = () => {
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <ActivityIndicator size="large" color={tw.color('primary')} />
    </View>
  );
};
