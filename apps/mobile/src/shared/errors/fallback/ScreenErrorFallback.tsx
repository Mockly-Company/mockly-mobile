import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tw } from '@mockly/design-system';
import { useErrorBoundary } from 'react-error-boundary';

type ScreenErrorFallbackProps = {
  screenName: string;
  message?: string;
};

export function ScreenErrorFallback({
  screenName,
  message,
}: ScreenErrorFallbackProps): React.ReactElement {
  const { resetBoundary } = useErrorBoundary();

  return (
    <View style={tw`flex-1 items-center justify-center p-6 bg-white`}>
      <View
        style={tw`w-20 h-20 bg-yellow-100 rounded-full items-center justify-center mb-4`}
      >
        <Text style={tw`text-xxl`}>😔</Text>
      </View>

      <Text style={tw`text-xl font-bold text-gray-900 mb-2 text-center`}>
        화면을 불러올 수 없습니다
      </Text>
      <Text style={tw`text-base text-gray-600 text-center mb-1`}>
        {message}
      </Text>
      <Text style={tw`text-sm text-gray-500 text-center mb-6`}>
        {screenName} 화면 로드 중 문제가 발생했습니다
      </Text>

      <TouchableOpacity
        style={tw`bg-primary px-6 py-3 rounded-lg shadow`}
        onPress={resetBoundary}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="다시 시도"
      >
        <Text style={tw`text-white text-base font-semibold`}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );
}
