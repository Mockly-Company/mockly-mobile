import { Icon, Text, tw } from '@mockly/design-system';
import { ImageBackground, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductBottomSheet } from '../ProductBottomSheetProvider';

export const ProductBanner = () => {
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      source={require('../../../../../assets/plan_header_bg.png')}
      style={tw`px-4 mb-6 pb-10 justify-end pt-[${insets.top + 32}] min-h-[50]`}
    >
      <CloseBottomSheetButton />
      <Text variant="h2" style={tw`text-white text-center z-10`}>
        어려웠던 면접,{'\n'}더 쉬워질거에요.
      </Text>
    </ImageBackground>
  );
};

const CloseBottomSheetButton = () => {
  const insets = useSafeAreaInsets();
  const { close: closeBottomSheet } = useProductBottomSheet();
  const handleCloseBottomSheet = () => {
    closeBottomSheet();
  };
  return (
    <View style={tw`absolute top-0 p-4 z-10 mt-[${insets.top}]`}>
      <TouchableOpacity
        onPress={handleCloseBottomSheet}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={tw`p-2 bg-black/20 rounded-full`}
      >
        <Icon name="x" size={20} style={tw`text-white`} />
      </TouchableOpacity>
    </View>
  );
};
