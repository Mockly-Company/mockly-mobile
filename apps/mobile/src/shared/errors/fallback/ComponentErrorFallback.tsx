import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tw } from '@mockly/design-system';
import { useErrorBoundary } from 'react-error-boundary';

type ComponentErrorFallbackProps = {
  message: string;
};
/**
 * Component 레벨 에러 Fallback UI
 */
export function ComponentErrorFallback({
  message,
}: ComponentErrorFallbackProps): React.ReactElement {
  const { resetBoundary } = useErrorBoundary();

  return (
    <View style={styles.default.container}>
      <View style={styles.default.iconContainer}>
        <Text style={styles.default.iconText}>ℹ️</Text>
      </View>

      <Text style={styles.default.title}>데이터를 불러올 수 없습니다</Text>
      <Text style={styles.default.message}>{message}</Text>

      <TouchableOpacity
        style={styles.default.retryButton}
        onPress={resetBoundary}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="다시 시도"
      >
        <Text style={styles.default.retryButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  minimal: {
    container: tw`p-4 bg-gray-50 rounded-lg items-center`,
    message: tw`text-sm text-gray-600 text-center mb-2`,
    retryButton: tw`bg-primary px-4 py-2 rounded`,
    retryButtonText: tw`text-white text-sm font-medium`,
  },
  default: {
    container: tw`p-6 bg-white rounded-lg border border-gray-200 items-center`,
    iconContainer: tw`w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-3`,
    iconText: tw`text-2xl`,
    title: tw`text-base font-semibold text-gray-900 mb-1 text-center`,
    message: tw`text-sm text-gray-600 text-center mb-4`,
    retryButton: tw`bg-primary px-5 py-2.5 rounded-lg`,
    retryButtonText: tw`text-white text-sm font-semibold`,
    debugText: tw`mt-3 text-xs text-gray-400`,
  },
};
