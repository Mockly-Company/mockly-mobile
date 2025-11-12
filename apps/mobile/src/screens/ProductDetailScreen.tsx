import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Text, Button } from '@mockly/design-system';
import { ProductDetail } from '@mockly/entities';
import { ProductService, ApiClient } from '@mockly/api';
import { useApi } from '../hooks/useApi';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

// TODO: Replace with actual API configuration
const apiClient = new ApiClient({ baseURL: 'https://api.mockly.example.com' });
const productService = new ProductService(apiClient);

export interface ProductDetailScreenProps {
  productId: string;
  onAddToCart?: (product: ProductDetail) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  productId,
  onAddToCart,
}) => {
  const {
    data: product,
    loading,
    error,
    refetch,
  } = useApi(() => productService.getProduct(productId), {
    autoFetch: true,
  });

  if (loading && !product) {
    return <LoadingState message="Loading product details..." />;
  }

  if (error && !product) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!product) {
    return null;
  }

  const formattedPrice = `${product.currency} ${product.price.toLocaleString()}`;

  return (
    <ScrollView style={styles.container}>
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="h2" style={styles.name}>
            {product.name}
          </Text>
          <Text variant="h3" style={styles.price}>
            {formattedPrice}
          </Text>
        </View>

        {product.category && (
          <View style={styles.section}>
            <Text variant="caption" style={styles.label}>
              Category
            </Text>
            <Text variant="body">{product.category}</Text>
          </View>
        )}

        {product.stock !== undefined && (
          <View style={styles.section}>
            <Text variant="caption" style={styles.label}>
              Stock
            </Text>
            <Text variant="body">{product.stock} units available</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text variant="caption" style={styles.label}>
            Description
          </Text>
          <Text variant="body" style={styles.description}>
            {product.description}
          </Text>
        </View>

        {product.options && product.options.length > 0 && (
          <View style={styles.section}>
            <Text variant="caption" style={styles.label}>
              Options
            </Text>
            {product.options.map(option => (
              <View key={option.id} style={styles.option}>
                <Text variant="body">{option.name}</Text>
                <Text variant="body" style={styles.optionPrice}>
                  +{product.currency} {option.price}
                </Text>
              </View>
            ))}
          </View>
        )}

        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <View style={styles.section}>
              <Text variant="caption" style={styles.label}>
                Specifications
              </Text>
              {Object.entries(product.specifications).map(([key, value]) => (
                <View key={key} style={styles.specification}>
                  <Text variant="body" style={styles.specKey}>
                    {key}:
                  </Text>
                  <Text variant="body" style={styles.specValue}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          )}

        {product.images && product.images.length > 0 && (
          <View style={styles.section}>
            <Text variant="caption" style={styles.label}>
              Additional Images
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageList}
            >
              {product.images.map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.additionalImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        <Button
          onPress={() => onAddToCart?.(product)}
          disabled={product.stock === 0}
          style={styles.addButton}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  name: {
    marginBottom: 8,
  },
  price: {
    color: '#007AFF',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  description: {
    lineHeight: 24,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionPrice: {
    color: '#007AFF',
  },
  specification: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specKey: {
    flex: 1,
    fontWeight: '600',
  },
  specValue: {
    flex: 2,
  },
  imageList: {
    marginTop: 8,
  },
  additionalImage: {
    width: 120,
    height: 120,
    marginRight: 12,
    borderRadius: 8,
  },
  addButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});
