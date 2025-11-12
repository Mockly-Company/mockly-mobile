import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@mockly/design-system';

export interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Oops! Something went wrong
      </Text>
      <Text style={styles.message}>{error.message}</Text>
      {onRetry && (
        <Button onPress={onRetry} style={styles.button}>
          Retry
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    minWidth: 120,
  },
});
