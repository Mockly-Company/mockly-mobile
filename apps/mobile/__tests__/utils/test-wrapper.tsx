import React, { createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

// Mock ProductBottomSheetProvider for tests
const ProductBottomSheetContext = createContext({
  expand: jest.fn(),
  close: jest.fn(),
});

export const useProductBottomSheet = () =>
  useContext(ProductBottomSheetContext);

const MockProductBottomSheetProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const contextValue = {
    expand: jest.fn(),
    close: jest.fn(),
  };

  return (
    <ProductBottomSheetContext.Provider value={contextValue}>
      {children}
    </ProductBottomSheetContext.Provider>
  );
};

// 각 테스트마다 새로운 QueryClient 생성
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface TestWrapperProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

/**
 * 테스트용 공통 Provider 래퍼
 * - NavigationContainer
 * - QueryClientProvider
 * - SafeAreaProvider
 * - ErrorBoundary
 * - MockProductBottomSheetProvider
 */
export const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  queryClient,
}) => {
  const client = queryClient || createTestQueryClient();

  return (
    <ErrorBoundary fallback={<></>}>
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 0, height: 0 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
      >
        <QueryClientProvider client={client}>
          <NavigationContainer>
            <MockProductBottomSheetProvider>
              {children}
            </MockProductBottomSheetProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};
