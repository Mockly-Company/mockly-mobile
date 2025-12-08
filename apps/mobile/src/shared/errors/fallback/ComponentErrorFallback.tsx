import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { tw, Text } from '@mockly/design-system';
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

      <Text
        variant="body"
        weight="semibold"
        color="black"
        align="center"
        style={tw`mb-1`}
      >
        데이터를 불러올 수 없습니다
      </Text>
      <Text variant="caption" color="secondary" align="center" style={tw`mb-4`}>
        {message}
      </Text>

      <TouchableOpacity
        style={tw`bg-primary px-5 py-2.5 rounded-lg`}
        onPress={resetBoundary}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="다시 시도"
      >
        <Text variant="caption" weight="semibold" color="white">
          다시 시도
        </Text>
      </TouchableOpacity>
    </View>
  );
}
