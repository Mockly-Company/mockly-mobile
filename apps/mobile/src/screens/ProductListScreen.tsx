import React, { useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text } from '@mockly/design-system';
import { Product } from '@mockly/entities';
import { ProductService, ApiClient } from '@mockly/api';
import { useApi } from '../hooks/useApi';
import { ProductCard } from '../components/ProductCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

// TODO: Replace with actual API configuration
const apiClient = new ApiClient({ baseURL: 'https://api.mockly.example.com' });
const productService = new ProductService(apiClient);

export interface ProductListScreenProps {
  onProductPress?: (product: Product) => void;
}

export const ProductListScreen: React.FC<ProductListScreenProps> = ({
  onProductPress,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useApi(
    () => productService.getProducts(),
    {
      autoFetch: true,
    },
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    onProductPress?.(product);
  };

  if (loading && !data) {
    return <LoadingState message="Loading products..." />;
  }

  if (error && !data) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const products = data?.products || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>
          Products
        </Text>
        {data && (
          <Text variant="caption" style={styles.subtitle}>
            {data.total} items
          </Text>
        )}
      </View>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="body" style={styles.emptyText}>
              No products available
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#999',
  },
});
