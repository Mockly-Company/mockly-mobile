import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tw } from '@mockly/design-system';
import { useErrorBoundary } from 'react-error-boundary';

type ScreenErrorFallbackProps = {
  screenName: string;
  message?: string;
};

/**
 * Screen 레벨 에러 Fallback UI
 * 화면 전체 데이터 로드 실패 시 표시되는 전체 화면 에러 UI
 */
export function ScreenErrorFallback({
  screenName,
  message,
}: ScreenErrorFallbackProps): React.ReactElement {
  const { resetBoundary } = useErrorBoundary();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>😔</Text>
      </View>

      <Text style={styles.title}>화면을 불러올 수 없습니다</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.description}>
        {screenName} 화면 로드 중 문제가 발생했습니다
      </Text>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={resetBoundary}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="다시 시도"
      >
        <Text style={styles.retryButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: tw`flex-1 items-center justify-center p-6 bg-white`,
  iconContainer: tw`w-20 h-20 bg-yellow-100 rounded-full items-center justify-center mb-4`,
  iconText: tw`text-3xl`,
  title: tw`text-xl font-bold text-gray-900 mb-2 text-center`,
  message: tw`text-base text-gray-600 text-center mb-1`,
  description: tw`text-sm text-gray-500 text-center mb-6`,
  retryButton: tw`bg-primary px-6 py-3 rounded-lg shadow`,
  retryButtonText: tw`text-white text-base font-semibold`,
  debugContainer: tw`mt-6 p-3 bg-gray-100 rounded w-full`,
  debugText: tw`text-xs text-gray-700 font-mono`,
};
