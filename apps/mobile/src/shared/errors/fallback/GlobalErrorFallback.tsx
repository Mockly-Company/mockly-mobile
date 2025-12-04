import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tw } from '@mockly/design-system';
import RNRestart from 'react-native-restart';

type GlobalErrorFallbackProps = {
  title: string;
  message: string;
};

export function GlobalErrorFallback({
  title,
  message,
}: GlobalErrorFallbackProps): React.ReactElement {
  const handleRestart = () => {
    // 앱 전체 재시작
    RNRestart.restart();
  };

  return (
    <View style={tw`flex-1 items-center justify-center p-6 bg-white`}>
      <View
        style={tw`w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6`}
      >
        <Text style={tw`text-4xl`}>⚠️</Text>
      </View>

      <Text style={tw`text-2xl font-bold text-gray-900 mb-2 text-center`}>
        {title}
      </Text>
      <Text style={tw`text-base text-gray-600 text-center mb-2`}>
        {message}
      </Text>
      <Text style={tw`text-sm text-gray-500 text-center mb-8`}>
        앱을 다시 시작해야 합니다
        {'\n'}
        문제가 계속되면 앱을 재설치해주세요
      </Text>

      <TouchableOpacity
        style={tw`bg-red-600 px-8 py-4 rounded-lg shadow-lg`}
        onPress={handleRestart}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="앱 다시 시작"
      >
        <Text style={tw`text-white text-lg font-bold`}>앱 다시 시작</Text>
      </TouchableOpacity>
    </View>
  );
}
