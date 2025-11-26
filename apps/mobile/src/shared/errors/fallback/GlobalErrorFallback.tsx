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
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>⚠️</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.description}>
        앱을 다시 시작해야 합니다
        {'\n'}
        문제가 계속되면 앱을 재설치해주세요
      </Text>

      <TouchableOpacity
        style={styles.restartButton}
        onPress={handleRestart}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="앱 다시 시작"
      >
        <Text style={styles.restartButtonText}>앱 다시 시작</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: tw`flex-1 items-center justify-center p-6 bg-white`,
  iconContainer: tw`w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6`,
  iconText: tw`text-4xl`,
  title: tw`text-2xl font-bold text-gray-900 mb-2 text-center`,
  message: tw`text-base text-gray-600 text-center mb-2`,
  description: tw`text-sm text-gray-500 text-center mb-8`,
  restartButton: tw`bg-red-600 px-8 py-4 rounded-lg shadow-lg`,
  restartButtonText: tw`text-white text-lg font-bold`,
  debugContainer: tw`mt-8 p-4 bg-gray-100 rounded-lg w-full max-w-md`,
  debugTitle: tw`text-xs text-gray-700 font-mono mb-2 font-bold`,
  debugText: tw`text-xs text-gray-700 font-mono`,
};
