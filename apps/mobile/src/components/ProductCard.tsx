import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@mockly/design-system';
import { Product } from '@mockly/entities';

export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  const formattedPrice = `${product.currency} ${product.price.toLocaleString()}`;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(product)}
      activeOpacity={0.7}
    >
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
        <Text variant="h3" numberOfLines={1} style={styles.name}>
          {product.name}
        </Text>
        {product.description && (
          <Text variant="caption" numberOfLines={2} style={styles.description}>
            {product.description}
          </Text>
        )}
        <View style={styles.footer}>
          <Text variant="body" weight="bold" style={styles.price}>
            {formattedPrice}
          </Text>
          {product.stock !== undefined && (
            <Text variant="caption" style={styles.stock}>
              Stock: {product.stock}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
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
  name: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: '#007AFF',
  },
  stock: {
    color: '#999',
  },
});
