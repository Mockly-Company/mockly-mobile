import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tw } from '@mockly/design-system';
import { useErrorBoundary } from 'react-error-boundary';

type ComponentErrorFallbackProps = {
  message: string;
};

export function ComponentErrorFallback({
  message,
}: ComponentErrorFallbackProps): React.ReactElement {
  const { resetBoundary } = useErrorBoundary();

  return (
    <View
      style={tw`p-6 bg-white rounded-lg border border-gray-200 items-center`}
    >
      <View
        style={tw`w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-3`}
      >
        <Text style={tw`text-2xl`}>ℹ️</Text>
      </View>

      <Text style={tw`text-base font-semibold text-gray-900 mb-1 text-center`}>
        데이터를 불러올 수 없습니다
      </Text>
      <Text style={tw`text-sm text-gray-600 text-center mb-4`}>{message}</Text>

      <TouchableOpacity
        style={tw`bg-primary px-5 py-2.5 rounded-lg`}
        onPress={resetBoundary}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="다시 시도"
      >
        <Text style={tw`text-white text-sm font-semibold`}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );
}
