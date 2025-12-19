import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { tw, Text } from '@mockly/design-system';

type ScreenErrorFallbackProps = {
  screenName: string;
  message?: string;
  onRetry?: () => void;
};

export function ScreenErrorFallback({
  screenName,
  message,
  onRetry,
}: ScreenErrorFallbackProps): React.ReactElement {
  return (
    <View style={tw`flex-1 items-center justify-center p-6 bg-white`}>
      <View
        style={tw`w-20 h-20 bg-yellow-100 rounded-full items-center justify-center mb-4`}
      >
        <Text variant="h1">😔</Text>
      </View>

      <Text variant="h2" color="black" align="center" style={tw`mb-2`}>
        화면을 불러올 수 없습니다
      </Text>
      <Text
        variant="body"
        color="textSecondary"
        align="center"
        style={tw`mb-1`}
      >
        {message}
      </Text>
      <Text
        variant="caption"
        color="textSecondary"
        align="center"
        style={tw`mb-6`}
      >
        {screenName} 화면 로드 중 문제가 발생했습니다
      </Text>

      <TouchableOpacity
        style={tw`bg-primary px-6 py-3 rounded-lg shadow`}
        onPress={onRetry}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="다시 시도"
      >
        <Text variant="body" weight="semibold" color="white">
          다시 시도
        </Text>
      </TouchableOpacity>
    </View>
  );
}
